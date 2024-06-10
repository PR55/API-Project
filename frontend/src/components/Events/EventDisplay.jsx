import { useNavigate } from "react-router-dom";
import { LuDot } from "react-icons/lu";


export default function EventDisplay({event}) {

    const navigate = useNavigate();

    const startDate = new Date(event.startDate);
    // const endDate = new Date(event.endDate);

    // console.log(event.about);

    return (
        <div id='eventDisplay' onClick={() => {
            navigate(`/events/${parseInt(event.id)}`)
        }}>
            <div id='eventTop'>
            <div id='displayImageBrowse'>
                <img src={event.previewImage} alt="" />
            </div>
            <div id='groupInfoDisplay'>
                <h4 id='fixAlign'>{`${startDate.getFullYear()}/${startDate.getMonth()+1}/${startDate.getDate()}`} <LuDot/> {`${startDate.getHours() > 12 ? `${startDate.getHours() - 12}`:startDate.getHours()}:${startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}`:startDate.getMinutes()}`}</h4>
                <h3>{event.name}</h3>
                <h4>{event.Venue? `${event.Venue.city}, ${event.Venue.state}`: `${event.Group.city}, ${event.Group.state}`}</h4>
                {/* <p>{`${group.numEvents} Events`} * {group.private ? 'Private' : 'Public'}</p> */}
            </div>
            </div>
            <div id='eventBottom'>
                {event.description}
            </div>

        </div>
    )
}
