import React from 'react';
import { toggleDarkMode } from '../../store/themeActions';
import { useSelector, useDispatch } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMoon,
  faSun,
  faQuestionCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

import './dropdownMenu-styles.css';

const DropdownMenu = (props) => {
  const { setDropdownIsOpen, isOpen, setView } = props;

  const darkMode = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const lightModeButton = (
    <>
      <FontAwesomeIcon className="dropdown-icon" icon={faSun} />
      <div className="dropdown-description">Light Mode</div>
    </>
  );

  const darkModeButton = (
    <>
      <FontAwesomeIcon className="dropdown-icon" icon={faMoon} />
      <div className="dropdown-description">Dark Mode</div>
    </>
  );

  return (
    <>
      {isOpen && (
        <div
          className="dropdown"
          onMouseEnter={() => setDropdownIsOpen(true)}
          onMouseLeave={() => setDropdownIsOpen(false)}
        >
          <button
            className="dropdown-btn top-btn"
            onClick={() => setView('myAccountView')}
          >
            <FontAwesomeIcon className="dropdown-icon" icon={faUser} />
            <div className="dropdown-description">Profile</div>
          </button>
          <button
            className="dropdown-btn divider-horizontal"
            onClick={handleToggleDarkMode}
          >
            {darkMode ? lightModeButton : darkModeButton}
          </button>
          <button
            className="dropdown-btn divider-horizontal"
            onClick={() => setView('aboutView')}
          >
            <FontAwesomeIcon
              className="dropdown-icon"
              icon={faQuestionCircle}
            />
            <div className="dropdown-description">About</div>
          </button>
          <button className="dropdown-btn bottom-btn" disabled>
            <FontAwesomeIcon className="dropdown-icon" icon={faSignOutAlt} />
            <div className="dropdown-description">Log Out</div>
          </button>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
