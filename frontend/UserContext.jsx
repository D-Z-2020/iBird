import { createContext } from 'react';

const UserContext = createContext({
    username: null,
    setUsername: () => { },
    isExpert: null,
    setIsExpert: () => { },
    selectedImage: null,
    setSelectedImage: () => { }
});

export default UserContext;
