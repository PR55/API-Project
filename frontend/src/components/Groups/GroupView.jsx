import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './Group.css';
import GroupDeleteModal from "../Delete Modal/GroupDeleteModal";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

export default function GroupView({ group, user}) {

    const [showMenu, setShowMenu] = useState(false);
    const closeMenu = () => setShowMenu(false);

    const navigate = useNavigate();
    const redirect = (path) => {
        navigate(path);
    }

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
                                user && user.id === group.organizerId
                                ?
                                <>
                                <button>Create Event</button>
                                {/* To the events creation page, change url to be /groups/:id/events/new */}
                                <button>Update</button>
                                {/* To update form. Change url to be /groups/:id/edit*/}
                                <OpenModalMenuItem
                                itemText='Delete'
                                onItemClick={closeMenu}
                                modalComponent={<GroupDeleteModal group={group} redirect={redirect}/>}
                                />
                                {/* To group list after delete */}
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
