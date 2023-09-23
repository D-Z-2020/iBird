import { useState } from 'react';
import { uploadImage } from '../api/api';

export default function BirdImageUploader({ onUploadComplete, location, timestamp }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        const token = localStorage.getItem('token');
        if (selectedFile && token) {
            uploadImage(token, selectedFile, location, timestamp)
                .then(res => {
                    console.log('Successfully uploaded');
                    onUploadComplete();
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
