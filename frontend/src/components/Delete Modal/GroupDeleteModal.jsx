// import { useState } from 'react';
// import * as sessionActions from '../../store/session';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useDispatch} from 'react-redux';
import './DeleteMenu.css'
import { removeGroup } from '../../store/group';

export default function GroupDeleteModal({group, redirect}){

    const {closeModal} = useModal();

    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const acceptDelete = async (e) => {
        e.preventDefault();
        closeModal();
        await dispatch(removeGroup(group.id));
        redirect('/groups');
    }

    const declineDelete = (e) => {
        e.preventDefault();
        closeModal();
    }

    return(
        <div id='deleteMenu'>
            <h1>Delete Group:</h1>
            <h2>{group.name}</h2>
            <h3>Are you sure you want to delete this group?</h3>
                <div>
                <button onClick={acceptDelete}> Yes (Delete group)</button>
                <button onClick={declineDelete}>No (Return to group page)</button>
                </div>
        </div>
    )
}
