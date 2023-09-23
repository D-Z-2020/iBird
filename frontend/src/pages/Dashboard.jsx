import React from 'react'
import UserContext from '../../UserContext'
import { useContext } from 'react'
import NavigationButton from '../components/NavigationButton';
import { useLocation } from 'react-router-dom';
import { getUserInfo } from '../api/api';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { username, setUsername } = useContext(UserContext);
    const location = useLocation();
    const [isExpert, setIsExpert] = useState(null);

    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');

        // Update the user state to null
        setUsername(null);
    };

    useEffect(() => {
        if (!username) return;
        getUserInfo(localStorage.getItem('token'), username)
            .then((res) => {
                setIsExpert(res.data.isExpert);
            })
    }, [username])

    return (
        <div>
            <p>Welcome, {username}</p>
            <NavigationButton path="/start" text="Getting Started!" />
            <br />
            <NavigationButton path="/community" text="Community" />
            <br />
            <NavigationButton path={`/users/${username}`} text="My Profile" state={{ from: location }} />
            <br />
            <NavigationButton path="/birds/collection" text="Bird Collection" />
            <br />
            <NavigationButton path="/challengesPage" text="Challenges" />
            <br />
            <NavigationButton path="/myKiwi" text="My Kiwi" />
            <br />
            {isExpert && <>
                <NavigationButton path="/expertOpinion" text="Expert Opinion" />
                <br />
            </>}

            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
