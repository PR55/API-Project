import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import './HomePage.css';
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEmojiEvents, MdGroupAdd } from "react-icons/md";
import { SiVfairs } from "react-icons/si";
import { allEvents } from "../../store/event";
import { allGroups } from "../../store/group";
import { useEffect } from "react";


export default function HomePage() {
    const sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(allGroups());
        dispatch(allEvents());
        // console.log('Groups status= ', groups)
    }, [])

    return (
        <div id='homePage'>
            <div id='titleSplash'>
                <div>
                    <h1>The People Platform-</h1>
                    <h2>Where interests become friendships</h2>
                    <p>Find groups and events to join! sign up today!</p>
                </div>
                <SiVfairs size={250}/>
            </div>
            <div id = 'sectionTwo'>
                <h2>How Greets Works</h2>
                <h3>Join a group in order to join their events! Connect with others in your local area!</h3>
            </div>
            <div id='navHolder'>
                <div className="homeNavs">
                    <FaPeopleGroup size={256} color='green'/>
                    <NavLink to='/groups'>See all groups</NavLink>
                    <p>See all the groups we have to offer!</p>
                </div>
                <div className="homeNavs">
                    <MdEmojiEvents size={255} color="green"/>
                    <NavLink to='/events'>Find an Event</NavLink>
                    <p>See all the groups we have to offer!</p>
                </div>
                <div className="homeNavs">
                    <MdGroupAdd size={256} color={sessionUser ? "green": 'red'}/>
                    {sessionUser
                        ? <Link to='/groups/create'>Make a group</Link>
                        : <Link className="disabled">Make a group</Link>
                    }
                    <p>See all the groups we have to offer!</p>
                </div>
            </div>
            <div id="buttonHolder">
                {
                    sessionUser ? null:
                    <button>Sign Up for Greets</button>
                }
            </div>
            <Outlet/>
        </div>
    )
}
