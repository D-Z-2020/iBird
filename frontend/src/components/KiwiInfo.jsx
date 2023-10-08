import { useState, useEffect } from "react";
import { levelUp, getUserInfo } from "../api/api";
import { Button, ProgressBar, Space } from 'antd-mobile'


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
        <div className="Kiwi_box">
            <div className="medal_box">
                <img src={`https://ibird-images.s3.ap-southeast-2.amazonaws.com/evolution/${user.kiwiStage}.png`} alt="Kiwi Bird" width={'300px'} />
            </div>

            <div className="row">
                <div className="cloumn">
                    <p className="cloumn_name">Level: </p>
                    <div className="cloumn_progress">
                        <Space direction='vertical' block>
                            <ProgressBar percent={user.kiwiLevel}  text={'Lv.'+user.kiwiLevel} />
                        </Space>
                    </div>
                </div>

                {user.kiwiLevel < 100 && 
                    <div className="cloumn">
                        <div className="cloumn_name">EXP:</div>
                        <div className="cloumn_progress">
                            <Space direction='vertical' block>
                                {/*<ProgressBar percent={(user.kiwiExp/expNeededForNextLevel)*100} text={user.kiwiExp+"/"+expNeededForNextLevel} />*/}
                                <ProgressBar percent={(Math.floor(user.kiwiExp)/expNeededForNextLevel)*100} text={Math.floor(user.kiwiExp)+"/"+Math.floor(expNeededForNextLevel)} />
                            </Space>
                        </div>
                    </div>}

                {canLevelUp && <>
                    <div className="cloumn">
                        <p className="cloumn_name">My Scores: </p>
                        <p className="cloumn_progress">
                            <Space direction='vertical' block>
                                {/*<ProgressBar percent={user.scores>0?'100':'0'} text={user.scores} />*/}
                                <ProgressBar percent={Math.floor(user.scores)>0?'100':'0'} text={Math.floor(user.scores)} />
                            </Space>
                        </p>
                    </div>
                    {user.kiwiLevel < 100 && <div className="cloumn_button"><Button block fill='outline' color='primary' onClick={handleLevelUp}>Level Up</Button></div>}
                </>}
            </div>
           
        </div>
    );
}
