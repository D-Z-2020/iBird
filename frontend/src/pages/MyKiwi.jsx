import KiwiInfo from "../components/KiwiInfo"
import UserContext from "../../UserContext";
import { useContext } from "react";
import NavigationButton from "../components/NavigationButton";

// Displaying the user's Kiwi information.
export default function MyKiwi() {
    const { username } = useContext(UserContext);
    return (
        <div>
            <NavigationButton path="/" text="My Kiwi" />

            {/* Display Kiwi information */}
            <KiwiInfo username={username} canLevelUp={true} />
        </div>
    )
}
