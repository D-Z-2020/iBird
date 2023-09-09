import { useState, useEffect } from 'react';
import { getImageByKey } from '../api/api';
import { useNavigator } from '../hooks/useNavigator';

export default function BirdTableRow({ image, setMapCenter, setSelectedImage }) {
    const [imageUrl, setImageUrl] = useState(null);
    const navigateWithState = useNavigator();

    const handleBirdLocationClick = () => {
        setSelectedImage(null);

        setTimeout(() => {
            setSelectedImage(image);
            setMapCenter(image.location);
        }, 100);
    };

    useEffect(() => {
        getImageByKey(localStorage.getItem('token'), image.s3Key)
            .then(res => {
                setImageUrl(res.data);
            })
            .catch(error => {
                console.error('Error fetching image:', error);
            });
    }, []);

    return (
        <tr>
            <td>{imageUrl && <img src={imageUrl} alt="Bird" width="100" />}</td>
            <td
                onClick={() => navigateWithState(`/bird/${image.birdId.name}`, { replace: true })}
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                {image.birdId.name}
            </td>

            <td>{image.timestamp}</td>
            <td
                onClick={() => handleBirdLocationClick()}
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                {JSON.stringify(image.location)}
            </td>
        </tr>
    );
}
