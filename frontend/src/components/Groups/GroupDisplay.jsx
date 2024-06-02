import { useNavigate } from "react-router-dom";

export default function GroupDisplay({ group }) {

    const navigate = useNavigate();

    return (
        <div id='groupDisplay' onClick={()=>{
            navigate(`/groups/${parseInt(group.id)}`);
        }}>
            <img src={group.previewImage} alt="" />
            <div id='groupInfoDisplay'>
                <h3>{group.name}</h3>
                <h4>{`${group.city}, ${group.state}`}</h4>
                <p>{group.about}</p>
                <p>{`${group.numEvents} Events`} * {group.private ? 'Private' : 'Public'}</p>
            </div>

        </div>
    )
}
