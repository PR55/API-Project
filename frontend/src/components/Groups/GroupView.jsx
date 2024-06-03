import {Link } from "react-router-dom";
import './Group.css';

export default function GroupView({group}) {
    return (
        <>
            <div id='groupView'>
                    <div>
                        {'< '}<Link to='/groups'>Groups</Link>
                    </div>
                    <div id='mainInfo'>
                        <img src={group.previewImage} alt="" />
                        <div>
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <p>{group.about}</p>
                        </div>
                    </div>
            </div>
        </>

    )
}
