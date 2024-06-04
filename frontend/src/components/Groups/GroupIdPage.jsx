import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams} from "react-router-dom";
import { allGroups } from "../../store/group";
import './Group.css';
import GroupView from "./GroupView";
import GroupViewBody from "./GroupViewBody";
import { allGroupEvents } from "../../store/curGroup";
// import { allGroupMembers } from "../../store/members";

export default function GroupIdPage() {
    const { groupId } = useParams();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const events = useSelector(state => state.groupEvents)
    const group = groups[parseInt(groupId)] ? groups[parseInt(groupId)] : {};
    // const memberships = useSelector(state => state.groupMembers)
    // const membership = memberships[user.id]?memberships[user.id] :null;

    const dispatch = useDispatch();

    async function updateGroups() {
        await dispatch(allGroups());
        await dispatch(allGroupEvents(groupId));
        // await dispatch(allGroupMembers(groupId));
    }

    useEffect(() => {
        updateGroups();
        // console.log('Groups status= ', groups)
    }, [groupId])
    return (
        <div>
            {Object.keys(group).length && group.name
                ?
                <div id='groupView'>
                    <GroupView group={group} user={user}/>
                    <GroupViewBody group={group} events = {Object.values(events)}/>
                </div>
                :
                <div id='groupView'>
                    <h1>Group does not exist</h1>
                </div>
            }
        </div>
    )
}
