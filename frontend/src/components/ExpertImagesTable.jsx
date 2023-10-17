import React from 'react'
import { useNavigator } from '../hooks/useNavigator'
import { Button} from 'antd-mobile'
import './ExpertImagesTable.css';

// The ExpertImagesTable component displays a table of images for expert review.
export default function ExpertImagesTable({ images, handleUpdateClick }) {
    const navigateWithState = useNavigator();
    return (
        <table className="expert-images-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Image</th>
                    <th>Bird Name</th>
                    <th>Update Bird</th>
                </tr>
            </thead>
            <tbody>
                {images.map(image => (
                    <tr key={image._id} className="table-row">
                        {/* Username cell with clickable navigation */}
                        <td className="clickable-cell"
                            onClick={() => navigateWithState(`/users/${image.userId.username}`, { replace: true })}
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                            {image.userId.username}
                        </td>

                        {/* Image cell */}
                        <td>
                            <img
                                src={image.imageUrl}
                                alt={`Bird by ${image.userId.username}`}
                                width="100"
                            />
                        </td>

                        {/* Bird name cell with clickable navigation */}
                        {image.birdId ?
                            <td className="clickable-cell"
                                onClick={() => navigateWithState(`/bird/${image.birdId.name}`, { replace: true })}
                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                {image.birdId.name}
                            </td> : <td>Not a Bird</td>
                        }
                        <td><button className="update-button" onClick={() => handleUpdateClick(image)}>Update</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
