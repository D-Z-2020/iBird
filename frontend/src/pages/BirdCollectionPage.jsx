import NavigationButton from '../components/NavigationButton';
import UserContext from "../../UserContext";
import { useContext } from "react";
import BirdCollection from '../components/BirdCollection';

export default function BirdCollectionPage() {
    const { username } = useContext(UserContext);

    return (
        <div>
            <NavigationButton path="/" text="back" />
            <BirdCollection username={username} showRemainBird={true} />
        </div>
    );
}
