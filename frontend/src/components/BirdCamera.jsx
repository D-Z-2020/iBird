import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState } from 'react';

export default function BirdCamera({ onPhotoCaptured }) {
    const [showCamera, setShowCamera] = useState(false);
    const [photoSrc, setPhotoSrc] = useState('');

    function handleTakePhoto(dataUri) {
        // Set the captured photo to state
        setPhotoSrc(dataUri);
    }

    function handleSubmitPhoto() {
        onPhotoCaptured(photoSrc);
        closeCamera();  // Close the camera once submitted
    }

    function closeCamera() {
        setPhotoSrc('');  // Clear photo
        setShowCamera(false);  // Hide camera
    }

    const cameraStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,  // Ensure it's above other components
        backgroundColor: 'black'
    };

    return (
        <div>
            {showCamera ? (
                <div style={cameraStyle}>
                    {photoSrc ? (
                        <div>
                            <img src={photoSrc} alt="Captured" />
                            <button onClick={() => setPhotoSrc('')}>Retake</button>
                            <button onClick={handleSubmitPhoto}>Submit</button>
                            <button onClick={closeCamera}>Back</button>
                        </div>
                    ) : (
                        <div>
                            <Camera onTakePhoto={(dataUri) => handleTakePhoto(dataUri)} />
                            <button onClick={closeCamera}>Back</button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={() => setShowCamera(true)}>Open Camera</button>
            )}
        </div>
    );
}
