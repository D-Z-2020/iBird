import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/api';
import { useParams, useLocation } from "react-router-dom";
import NavigationButton from '../components/NavigationButton';
import UserContext from '../../UserContext';
import { useContext } from 'react';
import { useFriendData } from '../hooks/useFriendData';
import { useFriendActions } from '../hooks/useFriendActions';

export default function Profile() {
    const [id, setId] = useState();
    const paramUsername = useParams().username;
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState(location.state?.from?.pathname || '/');
    const { friends, fetchFriends } = useFriendData();
    const { username } = useContext(UserContext);
    const { handleAddFriend, handleRemoveFriend } = useFriendActions();

    useEffect(() => {
        getUserInfo(localStorage.getItem("token"), paramUsername)
            .then((res) => {
                setId(res.data._id);
            })
            .catch((err) => {
                setId(null);
            })
    }, []);

    const determineBackPath = () => {
        if (previousPath === '/' || previousPath === '/community' || previousPath === '/community/findfriends'
            || previousPath === '/community/myfriends') {
            return previousPath;
        }
        return '/';
    };

    return (
        <div>
            <NavigationButton path={determineBackPath()} text="back" />
            {id ?
                <>
                    <p>User Name: {`${paramUsername}`}</p>
                    <p>User id: {`${id}`}</p>
                </> :
                <p>Not Found</p>
            }
            {id && <button style={{ display: username === paramUsername ? 'none' : 'block' }}
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
