import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/event";
import { useParams, Link } from "react-router-dom";

export default function EventView() {
    const {eventId} = useParams();
    const events = useSelector(state => state.events);
    const event = events[parseInt(eventId)]?events[parseInt(eventId)] :{};

    const dispatch = useDispatch();

    const startDate = new Date(event.startDate);
    // const endDate = new Date(event.endDate);

    useEffect(() => {
        dispatch(allEvents());
        // console.log('Groups status= ', groups)
    }, [])

    return (
        <>
            {Object.keys(event).length && event.name
                ?
                <div>
                    <div>
                    {'< '}<Link to='/events'>Events</Link>
                    </div>
                    <img src={event.previewImage} alt="" />
                    <div>
                    <h4>{`${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDate()} | ${startDate.getHours()}:${startDate.getMinutes()}`}</h4>
                    <h3>{event.name}</h3>
                    <h4>{event.Venue? `${event.Venue.city}, ${event.Venue.state}`: `${event.Group.city}, ${event.Group.state}`}</h4>
                    <p>{event.about}</p>
                    </div>
                </div>
                :
                <div>
                    <h1>Event does not exist</h1>
                </div>
            }
        </>

    )
}
