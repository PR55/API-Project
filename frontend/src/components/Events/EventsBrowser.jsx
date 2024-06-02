import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/event";
import EventDisplay from "./EventDisplay";

export default function EventsBrowser() {
    const events = useSelector(state => state.events);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allEvents());
        // console.log('Groups status= ', groups)
    }, [])


    return (
        <div>
            <p>Events in Meetup</p>
            {Object.values(events).map(event => {
                return(
                    <EventDisplay key={event.id} event={event}/>
                )
            })}
        </div>
    )
}
