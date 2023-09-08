import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useFriendActions } from '../hooks/useFriendActions';

export default function UserList({ users, allowFriendActions = false, onFriendActionSuccess = () => { }, cantAddedFriendUsernames = [], excludedUsers = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleAddFriend, handleRemoveFriend } = useFriendActions();

    return (
        <div>
            <h1>Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>User Name</th>
                        {allowFriendActions && <th>Add Friend</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        !excludedUsers.includes(user.username)
                        &&
                        <tr key={user._id}>
                            <td
                                onClick={() => navigate(`/users/${user.username}`, { replace: true, state: { from: location } })}
                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                {user.username}
                            </td>

                            {allowFriendActions &&
                                <td
                                    onClick={cantAddedFriendUsernames.includes(user.username) ?
                                        () => handleRemoveFriend(user.username, onFriendActionSuccess) :
                                        () => handleAddFriend(user.username, onFriendActionSuccess)}
                                    style={{ cursor: 'pointer' }}>
                                    {cantAddedFriendUsernames.includes(user.username) ? "❤️" : "🤍"}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
