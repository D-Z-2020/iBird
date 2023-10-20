import { createContext } from 'react';

// Creating a UserContext with default values. 
// This context will provide a way to pass down 
// user-related data and functions throughout the component tree 
// without having to pass props manually at every level.
const UserContext = createContext({
    username: null,
    setUsername: () => { },
    selectedImage: null,
    setSelectedImage: () => { }
});

export default UserContext;
