import React, { useState, useEffect } from 'react';
import NavigationButton from '../components/NavigationButton';
import BirdCard from '../components/BirdCard';
import { getAllbirds, getMybirds } from '../api/api';

export default function BirdCollection() {
    const [myBirds, setMyBirds] = useState([]);
    const [allBirds, setAllBirds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBirds = async () => {
            try {
                const allBirdsResponse = await getAllbirds(localStorage.getItem('token'));
                const myBirdsResponse = await getMybirds(localStorage.getItem('token'));

                setAllBirds(allBirdsResponse.data);
                setMyBirds(myBirdsResponse.data);
            } catch (err) {
                setError("Failed to fetch birds.");
            } finally {
                setLoading(false);
            }
        };

        fetchBirds();
    }, []);

    const notOwnedBirds = allBirds.filter(
        (bird) => !myBirds.some((myBird) => myBird._id === bird._id)
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <NavigationButton path="/" text="back" />

            <div>
                <h2>My Birds</h2>
                <div className="bird-grid">
                    {myBirds.map((bird) => (
                        <BirdCard key={bird._id} bird={bird} />
                    ))}
                </div>
            </div>

            <div>
                <h2>Keep looking for these birds</h2>
                <div>
                    {notOwnedBirds.map((bird) => (
                        <BirdCard key={bird._id} bird={bird} />
                    ))}
                </div>
            </div>
        </div>
    );
}
