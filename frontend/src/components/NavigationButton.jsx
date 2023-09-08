import React from 'react'
import { useNavigate } from "react-router-dom";

export default function NavigationButton({ path, text, state }) {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => navigate(path, { replace: true, state })}>{text}</button>
        </div>
    )
}
