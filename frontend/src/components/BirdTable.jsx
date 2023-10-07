import BirdTableRow from "./BirdTableRow";
export default function BirdTable({ trip, setMapCenter, setSelectedImage }) {
    return (
        <div style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
            <table style={{ width: "100%" }}>
                {/* <thead>
                    <tr>
                        <th>Image</th>
                        <th>Identified As</th>
                        <th>Timestamp</th>
                        <th>Location</th>
                        <th>Expert</th>
                    </tr>
                </thead> */}
                <tbody>
                    {trip && trip.images.map((image, index) => (
                        <BirdTableRow key={index} image={image} setMapCenter={setMapCenter} setSelectedImage={setSelectedImage} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
