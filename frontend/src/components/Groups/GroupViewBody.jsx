import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, Link } from "react-router-dom";
// import { allGroups } from "../../store/group";
import './Group.css';
// import { allEvents } from "../../store/event";
import EventDisplay from '../Events/EventDisplay.jsx'

export default function GroupViewBody({ group, events }) {

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    async function organizeDates() {
        const todaysDate = new Date();

        let pastArr = [];
        let futureArr = [];

        for (let event of events) {
            let start = new Date(event.startDate);
            if (start > todaysDate) {
                futureArr.push(event);
            } else {
                pastArr.push(event);
            }
        }

        await futureArr.sort((a,b) => {
            let date1 = new Date(a.startDate);
            let date2 = new Date(b.startDate);
            if(date1 > date2) return -1;
            if(date1 < date2) return 1;
            if(date1 == date2) return 0;
        })

        await pastArr.sort((a,b) => {
            let date1 = new Date(a.endDate);
            let date2 = new Date(b.endDate);
            if(date1 > date2) return -1;
            if(date1 < date2) return 1;
            if(date1 == date2) return 0;
        })

        setUpcomingEvents(futureArr);
        setPastEvents(pastArr);

    }

    useEffect(() => {
        organizeDates();
    }, [events])

    return (
        <div id='groupViewBody'>
            <div>
                <h3>Organizer</h3>
                <p>{group.organizer.firstName} {group.organizer.lastName}</p>
            </div>
            <div>
                <h3>All about us:</h3>
                <p>{group.about}</p>
            </div>
            {
                upcomingEvents.length
                    ?
                    <div>
                        <h3>Upcoming Events ({upcomingEvents.length})</h3>
                        <div>
                            {upcomingEvents.map(event => (
                                <EventDisplay event = {event} key={event.id}/>
                            ))}
                        </div>
                    </div>
                    : null
            }
            {
                pastEvents.length
                    ?
                    <div>
                        <h3>Past Events ({pastEvents.length})</h3>
                        <div>
                            {pastEvents.map(event => (
                                <EventDisplay event = {event} key={event.id}/>
                            ))}
                        </div>
                    </div>
                    : null
            }
            {
                !upcomingEvents.length && !pastEvents.length ? <h3>No events for this Group</h3>:null
            }

        </div>

    )
}
