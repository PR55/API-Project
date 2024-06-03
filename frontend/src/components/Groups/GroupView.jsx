import { Link } from "react-router-dom";
import './Group.css';

export default function GroupView({ group, user}) {
    return (
        <>
            <div id='groupView'>
                <div id='mainInfo'>
                    <div id='leftGroup'>
                        <div>{'< '}<Link to='/groups'>Groups</Link></div>
                        <div className="imageHolder"><img src={group.previewImage} alt="" /></div>
                    </div>
                    <div id='rightGroup'>
                        <div className="upper">
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <p>{group.numEvents} events * {group.private ? 'Private' : 'Public'}</p>
                            <p>{`Organized by ${group.organizer.firstName} ${group.organizer.lastName}`}</p>
                        </div>
                        <div className="lower">
                            {
                                user.id === group.organizerId
                                ?
                                <>
                                <button>Create Event</button>
                                <button>Update</button>
                                <button>Delete</button>
                                </>
                                :
                                <button>Join this Group</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
