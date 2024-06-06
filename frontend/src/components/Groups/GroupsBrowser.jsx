import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allGroups } from "../../store/group";
import GroupDisplay from "./GroupDisplay";

export default function GroupsBrowser(){

    const groups = useSelector(state => state.groups);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(allGroups());
        // console.log('Groups status= ', groups)
    }, [])

    return (
        <div>
            <h2>Groups in Meetup</h2>
            { groups && Object.values(groups).map(group => {
                return (
                    <div key={group.id}>
                        <GroupDisplay  group={group}/>
                        <hr />
                    </div>
                )})}
        </div>
    )
}
