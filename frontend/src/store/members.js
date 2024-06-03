import { csrfFetch } from './csrf.js';

const LOAD_GROUP_MEMBERS = 'group/LOAD/members';

const loadGroups = (groups) =>{
    return{
        type:LOAD_GROUP_MEMBERS,
        groups
    }
}

export const allGroupMembers = (id) => async (dispatch)=>{
    const response = await csrfFetch(`/api/groups/${parseInt(id)}/members`);

    if(response.ok){
        const events = await response.json();
        console.log(events)
        dispatch(loadGroups(events));
        return events;
    }
}

export default function curGroupMemberssReducer(state = {}, action){
    switch(action.type){
        case LOAD_GROUP_MEMBERS:{
            const newState = {};

            for(let event of action.groups){
                newState[event.id] = event;
            }

            return newState;
        }
        default:
            return state;
    }
}
