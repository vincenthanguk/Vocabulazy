import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMoon,
  faQuestionCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

import './dropdownMenu-styles.css';

const DropdownMenu = (props) => {
  const { setDropdownIsOpen, isOpen, setView } = props;

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
          <button className="dropdown-btn divider-horizontal" disabled>
            <FontAwesomeIcon className="dropdown-icon" icon={faMoon} />
            <div className="dropdown-description">Dark Mode</div>
          </button>
          <button className="dropdown-btn divider-horizontal" disabled>
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
