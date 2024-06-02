import { useNavigate } from "react-router-dom";

export default function EventDisplay({ event}) {

    const navigate = useNavigate();

    const startDate = new Date(event.startDate);
    // const endDate = new Date(event.endDate);

    return (
        <div id='groupDisplay' onClick={() => {
            navigate(`/events/${parseInt(event.id)}`)
        }}>
            <img src={event.previewImage} alt="" />
            <div id='groupInfoDisplay'>
                <h4>{`${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDate()} | ${startDate.getHours()}:${startDate.getMinutes()}`}</h4>
                <h3>{event.name}</h3>
                <h4>{event.Venue? `${event.Venue.city}, ${event.Venue.state}`: `${event.Group.city}, ${event.Group.state}`}</h4>
                <p>{event.about}</p>
                {/* <p>{`${group.numEvents} Events`} * {group.private ? 'Private' : 'Public'}</p> */}
            </div>

        </div>
    )
}
