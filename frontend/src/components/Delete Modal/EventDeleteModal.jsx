import { useModal } from '../../context/Modal';
import { useDispatch} from 'react-redux';
import './DeleteMenu.css'
import { deleteEvent } from '../../store/event';

export default function EventDeleteModal({event, redirect}){

    const {closeModal} = useModal();

    const dispatch = useDispatch();

    const acceptDelete = async (e) => {
        e.preventDefault();
        closeModal();
        await dispatch(deleteEvent(event.id));
        redirect('/events');
    }

    const declineDelete = (e) => {
        e.preventDefault();
        closeModal();
    }

    return(
        <div id='deleteMenu'>
            <h1>Delete Event:</h1>
            <h2>{event.name}</h2>
            <h3>Are you sure you want to delete this Event?</h3>
                <div>
                <button className='confirm' onClick={acceptDelete}>Yes (Delete event)</button>
                <button className='decline' onClick={declineDelete}>No (Return to event page)</button>
                </div>
        </div>
    )
}
