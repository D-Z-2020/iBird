import { useState, useEffect } from "react";
import { levelUp, getUserInfo } from "../api/api";

export default function KiwiInfo({ username, canLevelUp }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (username) {
            getUserInfo(localStorage.getItem('token'), username)
                .then((res) => {
                    setUser(res.data);
                    console.log(res.data);
                });
        }
    }, [username]);

    const handleLevelUp = () => {
        if (user.scores === 0) return;
        levelUp(localStorage.getItem('token'))
            .then(res => {
                setUser(res.data);
            })
            .catch(error => {
                console.error("Error leveling up:", error);
            });
    };

    if (!user) return <div>Loading...</div>;

    const expNeededForNextLevel = user.kiwiLevel * 1000;

    return (
        <div>
            <h2>My Kiwi</h2>
            <img src={`https://ibird-images.s3.ap-southeast-2.amazonaws.com/evolution/${user.kiwiStage}.png`} alt="Kiwi Bird" width={'300px'} />
            <div>Level: {user.kiwiLevel}</div>
            <div>Stage: {user.kiwiStage}</div>
            {user.kiwiLevel < 100 && <div>EXP: {user.kiwiExp} / {expNeededForNextLevel}</div>}
            {canLevelUp && <>
                <div>My Scores: {user.scores}</div>
                {user.kiwiLevel < 100 && <button onClick={handleLevelUp}>Level Up</button>}
            </>}
        </div>
    );
}
