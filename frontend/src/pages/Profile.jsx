import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/api';
import { useParams, useLocation } from "react-router-dom";
import NavigationButton from '../components/NavigationButton';
import UserContext from '../../UserContext';
import { useContext } from 'react';
import { useFriendData } from '../hooks/useFriendData';
import { useFriendActions } from '../hooks/useFriendActions';
import BirdCollection from '../components/BirdCollection';
import Challenges from '../components/Challenges';
import KiwiInfo from '../components/KiwiInfo';

export default function Profile() {
    const [taragetUser, setTaragetUser] = useState(null);
    const paramUsername = useParams().username;
    const previousPath = useLocation().state?.from?.pathname || '/';
    const { friends, fetchFriends } = useFriendData();
    const { username } = useContext(UserContext);
    const { handleAddFriend, handleRemoveFriend } = useFriendActions();

    useEffect(() => {
        getUserInfo(localStorage.getItem("token"), paramUsername)
            .then((res) => {
                setTaragetUser(res.data);
            })
            .catch((err) => {
                setTaragetUser(null);
            })
    }, []);

    return (
        <div>
            <NavigationButton path={previousPath} text="back" />
            {taragetUser ?
                <>
                    <p>User Name: {`${paramUsername}`}</p>
                    <p>User id: {`${taragetUser._id}`}</p>
                    <p>Total Walking Distance: {`${taragetUser.totalWalkingDistance}`}</p>
                    <p>Total Elevation Gain: {`${taragetUser.totalElevationGain}`}</p>
                    <p>Total Correct Quizes: {`${taragetUser.totalCorrectQuizes}`}</p>
                </> :
                <p>Not Found</p>
            }
            <KiwiInfo username={paramUsername} canLevelUp={false}/>
            <BirdCollection username={paramUsername} showRemainBird={false} />
            <Challenges username={paramUsername} />
            {taragetUser && <button style={{ display: username === paramUsername ? 'none' : 'block' }}
                onClick={username === paramUsername ?
                    () => { } :
                    friends.includes(paramUsername) ?
                        () => handleRemoveFriend(paramUsername, fetchFriends) :
                        () => handleAddFriend(paramUsername, fetchFriends)}>
                {username === paramUsername ? '' : friends.includes(paramUsername) ? "❤️" : "🤍"}
            </button>}
        </div>
    )
}
