import UsernamePasswordForm from '../components/UsernamePasswordForm'
import { create } from '../api/api';
import UserContext from '../../UserContext';
import { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function UserRegister() {
    const { setUsername } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (username, password) => {
        create(username, password)
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
            <h1>Register</h1>
            <UsernamePasswordForm buttonText="Register" onSubmit={handleSubmit} />

            <p>
                Already have an account, <Link to="/login">go login!</Link>
            </p>
        </div>
    )
}
