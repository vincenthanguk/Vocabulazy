import React from 'react';

import './dropdownMenu-styles.css';

const DropdownMenu = (props) => {
  const { isOpen } = props;

  return (
    <>
      {isOpen && (
        <div className="dropdown">
          <ul className="dropdown-menu">
            <li>
              <a href="#option1">Profile</a>
            </li>
            <li>
              <a href="#option2">Dark Mode</a>
            </li>
            <li>
              <a href="#option3">About</a>
            </li>
            <li>
              <a href="#option3">Log Out</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default DropdownMenu;
