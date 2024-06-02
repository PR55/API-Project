import { csrfFetch } from './csrf.js';

const LOAD_GROUPS = 'group/LOAD'
const PATCH_GROUP = 'group/PATCH'
const DELETE_GROUP = 'group/DELETE'

const loadGroups = (groups) =>{
    return{
        type:LOAD_GROUPS,
        groups
    }
}

// const postGroup = (group) =>{
//     return{
//         type:POST_GROUP,
//         group
//     }
// }

const patchGroup = (group) =>{
    return{
        type:PATCH_GROUP,
        group
    }
}

const deleteGroup = (group) =>{
    return{
        type:DELETE_GROUP,
        group
    }
}

export const allGroups = () => async (dispatch)=>{
    const response = await csrfFetch('/api/groups');

    if(response.ok){
        const groups = await response.json();
        dispatch(loadGroups(groups.Groups));
        return groups;
    }
}

export const newGroup = (payload) => async (dispatch)=>{
    const {name, about, type, privat, city,state, imageUrl}=payload;
    const response = await csrfFetch('/api/groups',{
        method:"POST",
        body:JSON.stringify({
            name,
            about,
            type,
            private:privat,
            city,
            state
        })
    });

    const data=await response.json();

    // console.log(data);

    const responseImage = await csrfFetch(`/api/groups/${data.id}/images`,{
        method:"POST",
        body:JSON.stringify({
            url:imageUrl,
            preview:true
        })
    });

    // const dataImage = await responseImage.json();

    if(response.ok){
        const response2 = await csrfFetch('/api/groups');

        const data2 = await response2.json();

        await dispatch(loadGroups(data2.Groups));
    }

    return {response, responseImage};
}

export const updateGroup = (payload, id) => async(dispatch) => {
    const {name, about, type, privat, city,state}=payload;
    const response = await csrfFetch(`/api/groups/${parseInt(id)}`,{
        method:"PUT",
        body:JSON.stringify({
            name,
            about,
            type,
            private:privat,
            city,
            state
        })
    });

    const data=await response.json();
    await dispatch(patchGroup(data));
    return response;
}

export const removeGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${parseInt(id)}`, {
        method:'DELETE'
    });

    const data = await response.json();
    await dispatch(deleteGroup(data));
}

function groupReducer(state = {}, action) {
    switch (action.type) {
      case LOAD_GROUPS:{
        const newGroupState = {};
        for(let item of action.groups){
            newGroupState[item.id] = item;
        }
        return newGroupState;
      }
      case PATCH_GROUP:{
        const newGroupState = {...state};
        newGroupState[action.group.id] = action.group;
        return newGroupState;
      }
      case DELETE_GROUP:{
        const newGroupState = {};
        for(let val of Object.values(state)){
            if(val.id !== action.group.id){
                newGroupState[val.id]=val;
            }
        }
        return newGroupState;
      }
      default:
        return state;
    }
  }

  export default groupReducer;
