import NavigationButton from '../components/NavigationButton';
import UserContext from "../../UserContext";
import { useContext } from "react";
import BirdCollection from '../components/BirdCollection';
import { useLocation } from 'react-router-dom';

// This page serves as the main page for displaying the user's bird collection.
export default function BirdCollectionPage() {
    // Using the UserContext to get the current username
    const { username } = useContext(UserContext);
    const previousPath = useLocation().state?.from?.pathname || '/';

    return (
        <div>
            <NavigationButton path={previousPath} text="Bird Collection" />
            <BirdCollection username={username} showRemainBird={true} />
        </div>
    );
}
