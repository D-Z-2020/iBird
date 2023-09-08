import { getAllUsers, searchUsernameSubstring } from '../api/api';
import UserList from '../components/UserList';
import { useState, useEffect } from 'react';
import NavigationButton from '../components/NavigationButton';
import { useContext } from 'react';
import UserContext from '../../UserContext';
import { useFriendData } from '../hooks/useFriendData';

export default function FindFriend() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const { username } = useContext(UserContext);
    const { friends, fetchFriends } = useFriendData();


    useEffect(() => {
        getAllUsers(localStorage.getItem('token'))
            .then((res) => {
                setUsers(res.data);
            });
    }, []);


    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);

        if (searchTerm === '') {
            getAllUsers(localStorage.getItem('token'))
                .then((res) => {
                    setUsers(res.data);
                });
        } else {
            searchUsernameSubstring(localStorage.getItem('token'), searchTerm)
                .then((res) => {
                    setUsers(res.data);
                });
        }
    };

    return (
        <div>
            <NavigationButton path="/community" text="back" />
            <br />
            <input
                type="text"
                placeholder="Search users by username"
                value={search}
                onChange={handleSearchChange}
            />
            <UserList users={users} allowFriendActions={true} onFriendActionSuccess={fetchFriends} cantAddedFriendUsernames={friends} excludedUsers={[username]} />
        </div>
    );
}
