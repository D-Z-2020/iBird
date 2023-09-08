import NavigationButton from "../components/NavigationButton"

export default function Community() {
    return (
        <div>
            <NavigationButton path="/" text="back" />
            <br />
            <NavigationButton path="/community/findfriends" text="Find Friends" />
            <br />
            <NavigationButton path="/community/myfriends" text="My Friends" />
        </div>
    )
}
