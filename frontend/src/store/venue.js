import { csrfFetch } from './csrf.js';

const loadVenuesForGroup = 'group/venue/LOAD'

const loadVenues = (venues) => {
    return{
        type:loadVenuesForGroup,
        venues:venues
    }
}

export const venuesForGroup = (id) => async(dispatch) => {
    const response = await csrfFetch(`/api/groups/${parseInt(id)}/venues`);

    if(response.ok){
        const data = await response.json();
        console.log(data);
        await dispatch(loadVenues(data))
        return data;
    }
}

export default function venueReducer(state={}, action){
    switch (action.type){
        case loadVenuesForGroup:{
            let newState = {};
            for(let venue of action.venues){
               newState[venue.id]=venue;
            }
            return newState;
        }
        default:{
            return state;
        }
    }
}
