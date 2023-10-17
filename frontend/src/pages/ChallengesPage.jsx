import UserContext from "../../UserContext";
import { useContext } from "react";
import Challenges from "../components/Challenges";
import NavigationButton from "../components/NavigationButton";

// This page serves as the main page for displaying the user's challenges and badges.
export default function ChallengesPage() {
    const { username } = useContext(UserContext);

    return (
        <div>
            <NavigationButton path="/" text="My Badges" />
            <Challenges username={username} />
        </div>
    );
};
