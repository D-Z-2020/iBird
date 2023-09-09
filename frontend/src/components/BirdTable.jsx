import BirdTableRow from "./BirdTableRow";
export default function BirdTable({ trip, setMapCenter, setSelectedImage }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Identified As</th>
                    <th>Timestamp</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                {trip && trip.images.map(image => (
                    <BirdTableRow key={image.s3Key} image={image} setMapCenter={setMapCenter} setSelectedImage={setSelectedImage}/>
                ))}
            </tbody>
        </table>
    );
}
