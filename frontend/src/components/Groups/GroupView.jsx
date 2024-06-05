import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './Group.css';
import GroupDeleteModal from "../Delete Modal/GroupDeleteModal";
import OpenModalDeleteItem from './OpenModalDeleteItem';
import { LuDot } from "react-icons/lu";

export default function GroupView({ group, user }) {



    const navigate = useNavigate();
    const redirect = (path) => {
        navigate(path);
    }

    return (
        <>
            <div id='groupView'>
                <div id='link'>{'< '}<Link to='/groups'>Groups</Link></div>
                <div id='mainInfo'>
                    <div id='leftGroup'>
                        <div className="imageHolder"><img src={group.previewImage} alt="" /></div>
                    </div>
                    <div id='rightGroup'>
                        <div className="upper">
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <div className="eventsPrivacyStatus">
                                <p>{`${group.numEvents} Events`}</p>
                                <LuDot />
                                <p>{group.private ? 'Private' : 'Public'}</p>
                            </div>
                            <p>{`Organized by ${group.organizer.firstName} ${group.organizer.lastName}`}</p>
                        </div>
                        <div className="lower">
                            {
                                user && (user.id === group.organizerId)
                                    ?
                                    <div className='align'>
                                        <button className='groupButton' onClick={()=>redirect(`/groups/${parseInt(group.id)}/event/new`)}>Create Event</button>
                                        {/* To the events creation page, change url to be /groups/:id/events/new */}
                                        {
                                            user.id === group.organizerId ?
                                                <div className='align'>
                                                    <button className='groupButton' onClick={() => redirect(`/groups/${parseInt(group.id)}/edit`)}>Update</button>
                                                    <OpenModalDeleteItem
                                                        className='groupButton'
                                                        id='groupDelete'
                                                        itemText='Delete'
                                                        modalComponent={<GroupDeleteModal group={group} redirect={redirect} />}
                                                    />
                                                </div>
                                                : null
                                        }
                                    </div>
                                    :
                                    <button disabled={!user} className='groupButton'>Join this Group</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
