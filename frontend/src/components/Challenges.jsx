import ChallengeCard from "./ChallengeCard";
import { getUserInfo } from "../api/api";
import { useState, useEffect } from "react";
import { ProgressCircle, Space } from 'antd-mobile'


export default function Challenges({ username }) {
    const [user, setUser] = useState(null);
    
    const achievedBadgeCount = user ? user.achievedChallanges.length : 0;
    const totalBadgeCount = 12;
    const progressPercentage = (achievedBadgeCount / totalBadgeCount) * 100;


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
        <div className="Challenges_box">
            <h2>Rewards Collected</h2>
            {challengeTypes.map(type => (
                challengeLevels.map(level => {
                    const achieved = user.achievedChallanges.some(ch => ch.type === type && ch.level === level);
                    return <ChallengeCard key={`${type}-${level}`} type={type} level={level} achieved={achieved} />;
                })
            ))}
            {achievedBadgeCount !== null && totalBadgeCount !== null && (
              <div className="progress_circle">
                  <Space style={{ '--gap': '150px' }}>
                      <ProgressCircle style={{ '--size': '90px',"font-weight":"bold","font-size":"large" }} percent={progressPercentage}>{`${Math.round(progressPercentage)}%`}</ProgressCircle>
                  </Space>
              </div>
            )}
        </div>
    );
};
