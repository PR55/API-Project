import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from "react-router-dom";
import { allGroups } from "../../store/group";

export default function GrouptView() {
    const { groupId } = useParams();
    const groups = useSelector(state => state.groups);
    const group = groups[parseInt(groupId)] ? groups[parseInt(groupId)] : {};

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allGroups());
        // console.log('Groups status= ', groups)
    }, [])

    return (
        <>
            {Object.keys(group).length && group.name
                ?
                <div>
                    <div>
                        {'< '}<Link to='/groups'>Groups</Link>
                    </div>
                    <div>
                        <img src={group.previewImage} alt="" />
                        <div>
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <p>{group.about}</p>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h1>Group does not exist</h1>
                </div>
            }
        </>

    )
}
