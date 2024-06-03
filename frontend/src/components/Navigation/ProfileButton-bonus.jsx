import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import './Navigation.css'
import { Link, useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
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
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const navigate = useNavigate();

  const logout = () => {
    // e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/');
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user ? (
        <div id='loggedOptions'>
          <Link>Make a new Group</Link>
          <div id='loggedButton'>
            <div className="dropdown">
              <button onClick={toggleMenu}><FaUserCircle size={28} /><FaChevronDown size={28} /></button>
            </div>
            <div className={showMenu ? "dropdown-content-show" : "dropdown-content-hide"}>
              <OpenModalMenuItem
                itemText={`Hello, ${user.username}`}
              />
              <OpenModalMenuItem
                itemText={user.email}
              />
              <OpenModalButton
                className='logOut'
                buttonText='Logout'
                onButtonClick={logout} />
            </div>
          </div>
        </div>
      ) : (
        <div id="authButtons">
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </>
  );
}

export default ProfileButton;
