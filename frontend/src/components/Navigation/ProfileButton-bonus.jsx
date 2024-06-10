import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import './Navigation.css'
import { Link} from 'react-router-dom';

function ProfileButton({ user, redirect }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      e.stopPropagation();
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    // document.addEventListener('click', toggleMenu);


    return () => {
      document.removeEventListener('click', closeMenu);
      // document.removeEventListener('click', toggleMenu)
    };
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = () => {
    // e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    redirect('/');
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user ? (
        <div id='loggedOptions'>
          <Link to='/groups/create'>Make a new Group</Link>
          <div id='loggedButton'>
            <div className="dropdown">
              <button onClick={toggleMenu}><FaUserCircle size={28} /><FaChevronDown size={28} /></button>
            </div>
            <div className={showMenu ? "dropdown-content-show" : "dropdown-content-hide"}>
              <OpenModalMenuItem
                itemText={`Hello, ${user.firstName}`}
              />
              <OpenModalMenuItem
                itemText={user.email}
              />
              <hr />
              <div id='modalOptions'>
              <OpenModalButton
                className='logOut'
                buttonText='View Groups'
                onButtonClick={() => {
                  closeMenu();
                  redirect('/groups')
                }} />
                <OpenModalButton
                className='logOut'
                buttonText='View Events'
                onButtonClick={() => {
                  closeMenu();
                  redirect('/events')
                }} />
              <OpenModalButton
                className='logOut'
                buttonText='Logout'
                onButtonClick={logout} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="authButtons">
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal redirect={redirect}/>}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal redirect={redirect}/>}
          />
        </div>
      )}
    </>
  );
}

export default ProfileButton;
