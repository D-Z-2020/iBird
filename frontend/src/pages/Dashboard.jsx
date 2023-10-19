import React from 'react'
import UserContext from '../../UserContext'
import { useContext } from 'react'
import NavigationButton from '../components/NavigationButton';
import { useLocation } from 'react-router-dom';
import { getUserInfo } from '../api/api';
import { useEffect, useState } from 'react';
import { AutoCenter } from 'antd-mobile'
import { List, Switch,Image } from 'antd-mobile'
import { useNavigate } from "react-router-dom";
import { Button} from 'antd-mobile'
import './Dashboard.css';
import logo from '../../public/iBirdLogo.png';


// This page serves as the main dashboard for the user, 
// providing quick navigation to various features of the application.
export default function Dashboard() {
    const { username, setUsername } = useContext(UserContext);
    const location = useLocation();
    const [isExpert, setIsExpert] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');

        // Update the user state to null
        setUsername(null);
    };

    // Fetch user information when the username changes
    useEffect(() => {
        if (!username) return;
        getUserInfo(localStorage.getItem('token'), username)
            .then((res) => {
                setIsExpert(res.data.isExpert);
            })
    }, [username])

    return (
        <div>
                <div className="header">
                    <p className='title'>Welcome, {username}</p>
                    <img src={logo} alt="Project Logo" className="logo" />
                </div>

                {/* List of navigation items */}
                <List>
                    <List.Item onClick={()=> navigate("/start")}>Getting Started!</List.Item>
                    <List.Item onClick={()=>  navigate("/community")}>Community</List.Item>
                    <List.Item onClick={()=>  navigate(`/users/${username}`)}>My Profile</List.Item>
                    <List.Item onClick={()=>  navigate("/birds/collection")}>Bird Collection</List.Item>
                    <List.Item onClick={()=>  navigate("/challengesPage")}>Challenges</List.Item>
                    <List.Item onClick={()=>  navigate("/myKiwi")}>My Kiwi</List.Item>
                    
                    {/* Conditionally render Expert Opinion if the user is an expert */}
                    {isExpert && <>
                        <List.Item onClick={()=>  navigate("/expertOpinion")}>Expert Opinion</List.Item>
                        <br />
                    </>}
                </List>

                <div className='tx_center_button'>
                    <Button fill='outline' color='primary' onClick={handleLogout}>Logout</Button>
                </div>
        </div>
    )
}
