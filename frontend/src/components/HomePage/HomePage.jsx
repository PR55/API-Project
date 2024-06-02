import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HomePage(){
    const sessionUser = useSelector(state => state.session.user);

    return (
        <>
        <div id='titleSplash'>
            <div>
            <h1>The People Platform-</h1>
            <h2>Where interests become friendships</h2>
            <p>Find groups and events to join! sign up today!</p>
            </div>
            <img src="../../../public/greetsFavicon1.png" alt="" />
        </div>
        <div id='navHolder'>
        <div className="homeNavs">
                <img src="../../../public/greetsFavicon1.png" alt="" />
                <NavLink to='/groups#'>See all groups</NavLink>
                <p>See all the groups we have to offer!</p>
            </div>
            <div className="homeNavs">
                <img src="../../../public/greetsFavicon1.png" alt="" />
                <NavLink to='/events#'>See all Events</NavLink>
                <p>See all the groups we have to offer!</p>
            </div>
            <div className="homeNavs">
                <img src="../../../public/greetsFavicon1.png" alt="" />
                {sessionUser
                ? <Link>Make a group</Link>
                : <Link className="disabled">Make a group</Link>
            }
                <p>See all the groups we have to offer!</p>
            </div>
        </div>
        </>
    )
}
