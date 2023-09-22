import { useFriendActions } from '../hooks/useFriendActions';
import { useNavigator } from '../hooks/useNavigator';

export default function UserList({ users, allowFriendActions = false, onFriendActionSuccess = () => { }, cantAddedFriendUsernames = [], excludedUsers = [] }) {
    const navigateWithState = useNavigator();
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
                    {users && users.map((user) => (
                        !excludedUsers.includes(user.username)
                        &&
                        <tr key={user._id}>
                            <td
                                onClick={() => navigateWithState(`/users/${user.username}`, { replace: true })}
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
