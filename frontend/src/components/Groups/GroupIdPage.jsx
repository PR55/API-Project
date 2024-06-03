import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams} from "react-router-dom";
import { allGroups } from "../../store/group";
import './Group.css';
import GroupView from "./GroupView";
import GroupViewBody from "./GroupViewBody";
import { allGroupEvents } from "../../store/curGroup";

export default function GroupIdPage() {
    const { groupId } = useParams();
    const groups = useSelector(state => state.groups);
    const events = useSelector(state => state.groupEvents)
    const group = groups[parseInt(groupId)] ? groups[parseInt(groupId)] : {};

    const dispatch = useDispatch();

    async function updateGroups() {
        await dispatch(allGroups());
        await dispatch(allGroupEvents(groupId));
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
                    <GroupView group={group} />
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
