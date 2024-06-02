import { csrfFetch } from './csrf.js';

const LOAD_EVENTS = 'event/LOAD'

const loadGroups = (events) =>{
    return{
        type:LOAD_EVENTS,
        events
    }
}

export const allEvents = () => async (dispatch)=>{
    const response = await csrfFetch('/api/events');

    if(response.ok){
        const groups = await response.json();
        dispatch(loadGroups(groups.Events));
        return groups;
    }
}

function eventReducer(state = {}, action) {
    switch (action.type) {
      case LOAD_EVENTS:{
        const newGroupState = {};
        for(let item of action.events){
            newGroupState[item.id] = item;
        }
        return newGroupState;
      }
      default:
        return state;
    }
  }

  export default eventReducer;
