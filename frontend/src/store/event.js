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

export const newEvent = (payload, id) => async (dispatch)=>{
    const {name, about, type, capacity,price,privacy,startDate,endDate,imageUrl}=payload;
    const response = await csrfFetch(`/api/groups/${parseInt(id)}/events`, {
        method:"POST",
        body:JSON.stringify({
            name,
            description:about,
            private:privacy,
            type,
            capacity,
            price,
            startDate,
            endDate
        })
    });

    const data = await response.json();

    const responseImage = await csrfFetch(`/api/events/${parseInt(data.id)}/images`,{
        method:"POST",
        body:JSON.stringify({
            url:imageUrl,
            preview:true
        })
    });

    await dispatch(allEvents());
    return data.id;
}

export const deleteEvent = (id) => async (dispatch)=>{
    const response = await csrfFetch(`/api/events/${parseInt(id)}}`, {
        method:"DELETE"
    });

    if(response.ok){
        const groups = await response.json();
        await dispatch(allEvents());
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
