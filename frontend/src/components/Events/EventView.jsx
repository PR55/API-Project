import { Link } from "react-router-dom";

export default function EventView({ event, group, user }) {

    const startDate = new Date(event.startDate);
    // const endDate = new Date(event.endDate);

    return (
        <>
            {Object.keys(event).length && event.name
                ?
                <div id='eventView'>
                    <div id='eventHeader'>
                        <div className="eventLink">
                            <p>{'<'}</p>
                            <Link to='/events'>Events</Link>
                            </div>
                        <div id='nameHeader'><h2>{event.name}</h2></div>
                        <div id='hostSubHeader'><h4>Hosted by {group.organizer.firstName} {group.organizer.lastName}</h4></div>

                    </div>
                    <div id='mainInfo'>
                        <div id='leftGroup'>

                            <div className="imageHolder"><img  src={event.previewImage} alt="" /></div>
                        </div>
                        <div id='rightGroup'>
                            <h4>{`${startDate.getFullYear()}/${startDate.getMonth()}/${startDate.getDate()} | ${startDate.getHours()}:${startDate.getMinutes()}`}</h4>
                            <h3>{event.name}</h3>
                            <h4>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : `${event.Group.city}, ${event.Group.state}`}</h4>
                            <p>{event.about}</p>
                        </div>
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
