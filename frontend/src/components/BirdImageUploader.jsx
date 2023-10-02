import { useState } from 'react';
import { uploadImage } from '../api/api';
import {Button} from 'antd-mobile'
// import './BirdImageUploader.css';

export default function BirdImageUploader({ onUploadComplete, location, timestamp }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (selectedFile && token) {
            uploadImage(token, selectedFile, location, timestamp)
                .then(res => {
                    console.log('Successfully uploaded');
                    onUploadComplete();
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className="uploader-container">
            {isLoading && <div className="loading">Loading...</div>}
            <input type="file" id="default-btn" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
            <Button color='primary'  onClick={handleUpload} disabled={isLoading}>Upload</Button>
        </div>
    ); 
    {/* return (
      <div className="uploader-container">
          {isLoading && <div className="loading">Loading...</div>}
          <label htmlFor="default-btn" className="file-label">
              <input type="file" id="default-btn" className="file-input" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
              Choose File
          </label>
          <Button color='primary' onClick={handleUpload} disabled={isLoading}>Upload</Button>
      </div>
    ); */}
}
