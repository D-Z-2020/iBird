import { useLocation, useNavigate } from 'react-router-dom';

// Custom hook 'useNavigator' to encapsulate navigation functionality.
export const useNavigator = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateWithState = (path, options = {}) => {
        navigate(path, {
            ...options,
            state: { ...options.state, from: location }
        });
    };

    return navigateWithState;
};
