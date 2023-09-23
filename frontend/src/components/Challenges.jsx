import ChallengeCard from "./ChallengeCard";
import { getUserInfo } from "../api/api";
import { useState, useEffect } from "react";

export default function Challenges({username}) {
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

    if (!user) return <div>Loading...</div>;

    const challengeTypes = ['birdCollection', 'correctQuizzes', 'walkingDistance', 'elevationGain'];
    const challengeLevels = ['bronze', 'silver', 'gold'];

    return (
        <div>
            <h2>Challenges</h2>
            {challengeTypes.map(type => (
                challengeLevels.map(level => {
                    const achieved = user.achievedChallanges.some(ch => ch.type === type && ch.level === level);
                    return <ChallengeCard key={`${type}-${level}`} type={type} level={level} achieved={achieved} />;
                })
            ))}
        </div>
    );
};
