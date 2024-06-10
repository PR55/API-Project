import ShowGroup from "./ShowGroup.jsx";
import { FaRegClock, FaMoneyBill } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import OpenModalDeleteItem from "../Groups/OpenModalDeleteItem.jsx";
import EventDeleteModal from "../Delete Modal/EventDeleteModal.jsx";

export default function EventViewBody({ group, event, user }) {

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const navigate = useNavigate();

    return (
        <>
            {Object.keys(event).length && event.name
                ?
                <div id='eventPageBody'>
                    <div id='mainInfoEvent'>
                        <div id='leftGroup'>
                            <div className="imageHolderEvent"><img src={event.previewImage} alt="" /></div>
                        </div>
                        <div id='rightGroup'>
                            <div id='rightGroupTop' onClick={e => {
                                e.preventDefault();
                                navigate(`/groups/${parseInt(group.id)}`)
                            }}>
                                <ShowGroup group={group} />
                            </div>
                            <div id='rightGroupBottom'>
                                <div id='timeDisplay'>
                                    <FaRegClock size={24} />
                                    <div id='timeHolder'>
                                        <div className="time">
                                            START
                                            <div>
                                                <p>{`${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`}</p>
                                                <LuDot />
                                                <p>{`${startDate.getHours()}:${startDate.getMinutes()}`}</p>
                                            </div>
                                        </div>
                                        <div className="time">
                                            END
                                            <div>
                                                <p>{`${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`}</p>
                                                <LuDot />
                                                <p>{`${endDate.getHours()}:${endDate.getMinutes()}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id='cost'>
                                    <FaMoneyBill size={24} />
                                    <p>{!event.price ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}</p>
                                </div>
                                <div>
                                    <div id='eventButtons'>
                                        {
                                            user && ((event.host && event.host.id === user.id) || (group.organizer && group.organizer.id === user.id))
                                                ?
                                                <>
                                                    <button className='eventManage' onClick={e => {
                                                        e.preventDefault();
                                                        alert('This feature is coming soon!')
                                                    }}>Update</button>
                                                    <OpenModalDeleteItem
                                                    className='eventManage'
                                                    itemText={'Delete'}
                                                    modalComponent={<EventDeleteModal event={event} redirect={navigate}/>}/>
                                                </>
                                                :
                                                <button
                                                id='eventJoin'
                                                disabled={!user}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    alert('This feature is coming soon!')
                                                }}>Join Event</button>
                                        }
                                    </div>
                                </div>
                                {/* <h4>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : `${event.Group.city}, ${event.Group.state}`}</h4> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Details</h3>
                        <p>{event.description}</p>
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
