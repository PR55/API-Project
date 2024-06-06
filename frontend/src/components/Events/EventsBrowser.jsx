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

    const vals = Object.values(events);

    vals.sort((a,b) => {
        let start1 = new Date(a.startDate);
        let start2 = new Date(b.startDate);
        let today = new Date();

        if(start1 < today || start1 < start2) return -1;
        if(start1 > start2) return 1;
        if (start1 === start2) return 0;
    })

    console.log(vals);

    return (
        <div>
            <h2>Events in Meetup</h2>
            {vals.map(event => {
                return (
                    (
                        <div key={event.id}>
                            <EventDisplay  event={event} />
                            <hr />
                        </div>
                    )
                )
            })}
        </div>
    )
}
