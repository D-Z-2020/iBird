import UsernamePasswordForm from '../components/UsernamePasswordForm'
import { login } from '../api/api';
import UserContext from '../../UserContext';
import { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (username, password) => {
        login(username, password)
            .then((res) => {
                const token = res.data.token;
                localStorage.setItem("token", token);
                setUsername(username);
                navigate("/", { replace: true });
            })
            .catch((err) => { alert(err); })
    }

    return (
        <div>
            <h1>Login</h1>
            <UsernamePasswordForm buttonText="Login" onSubmit={handleSubmit} />

            <p>
                Don't have account, <Link to="/register"> create one!</Link>
            </p>
        </div>
    )
}
