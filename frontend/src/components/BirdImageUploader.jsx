import { useState, useRef } from 'react';
import { uploadImage } from '../api/api';
import { Button } from 'antd-mobile'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Spinner from './Spinner';
// import './BirdImageUploader.css';

export default function BirdImageUploader({ onUploadComplete, location, timestamp, showCropPopup, setShowCropPopup }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const imgRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [crop, setCrop] = useState({
        unit: '%', // 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    })
    const [completedCrop, setCompletedCrop] = useState();
    const [upImg, setUpImg] = useState();
    const inputFileRef = useRef(null);

    const closeCropPopup = () => {
        setShowCropPopup(false);
        setSelectedFile(null);  // Set selected file to null on closing popup
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
    };

    const convertCropToPixels = (crop, imageWidth, imageHeight) => {
        if (crop.unit === '%') {
            return {
                x: (crop.x / 100) * imageWidth,
                y: (crop.y / 100) * imageHeight,
                width: (crop.width / 100) * imageWidth,
                height: (crop.height / 100) * imageHeight
            };
        }
        return crop; // If it's already in pixels, return as is.
    };

    const getCroppedImg = (image) => {
        const canvas = document.createElement('canvas')

        const pixelCrop = convertCropToPixels(crop, image.width, image.height);
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')
        const pixelRatio = window.devicePixelRatio

        canvas.width = scaleX * pixelCrop.width * pixelRatio
        canvas.height = scaleY * pixelCrop.height * pixelRatio
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY
        )

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = 'newFile.jpeg';
                window.URL.revokeObjectURL(blob); // Free up memory
                resolve(blob);
            }, 'image/jpeg', 0.4); // 0 (high compression) and 1 (no compression)
        });
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            setSelectedFile(e.target.files[0]);
            setShowCropPopup(true);
        }
    };

    const handleUpload = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (upImg && token) {
            const imageEl = imgRef.current;
            const croppedBlob = await getCroppedImg(imageEl);
            uploadImage(token, croppedBlob, location, timestamp) //selectedFile or croppedBlob
                .then(res => {
                    console.log('Successfully uploaded');
                    onUploadComplete();
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                    closeCropPopup();
                });
        }
    };

    return (
        <div className="uploader-container">
            {isLoading && <Spinner />}
            <input type="file" id="default-btn" accept="image/*" onChange={handleFileChange} disabled={isLoading} ref={inputFileRef} />
            {showCropPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '-122px 0 0 0'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            style={{ maxHeight: '50vh', margin: '10vh auto' }}
                        >
                            <img src={upImg} ref={imgRef} />
                        </ReactCrop>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                            <Button color='primary' onClick={handleUpload} disabled={isLoading}>Upload</Button>
                            <Button color='primary' onClick={closeCropPopup} disabled={isLoading}>Discard</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
