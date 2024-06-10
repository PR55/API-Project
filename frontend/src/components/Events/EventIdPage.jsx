import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/event";
import { allGroups } from "../../store/group";
import { Outlet, useParams} from "react-router-dom";
import EventView from "./EventView";
import EventViewBody from "./EventViewBody";
import './Event.css'

export default function EventIdPage() {
    const {eventId} = useParams();
    const events = useSelector(state => state.events);
    const event = events[parseInt(eventId)]?events[parseInt(eventId)] :{};
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[parseInt(event.groupId)] ? groups[parseInt(event.groupId)] : {};
    // const memberships = useSelector(state => state.groupMembers)
    // const membership = memberships[user.id]?memberships[user.id] :null;

    const dispatch = useDispatch();

    async function updateGroups() {
        await dispatch(allEvents());
        await dispatch(allGroups());
        // await dispatch(allGroupMembers(groupId));
    }

    useEffect(() => {
        updateGroups();
        // console.log('Groups status= ', groups)
    }, [eventId])
    return (
        <div id='eventView'>
            {Object.keys(event).length && group.name
                ?
                <div id=''>
                    <EventView event = {event} group ={group} user={user}/>
                    <EventViewBody event={event} group={group} user={user}/>
                </div>
                :
                <div id='groupView'>
                    <h1>Group does not exist</h1>
                </div>
            }
            <Outlet/>
        </div>
    )
}
