import React from 'react';
import './myAccount-styles.css';

const MyAccount = (props) => {
  const { toggle } = props;

  return (
    <div className="modal" onClick={toggle}>
      <div className="modal-main">
        <h1>User Name (Crackin' Gramms since xx/xx/xxxx) </h1>
        <h2>Statistics</h2>
        <p>Total Decks</p>
        <p>Total Cards</p>
        <p>Study Sessions</p>
        <p>Delete Account</p>
        <button onClick={toggle}>X</button>
      </div>
    </div>
  );
};

export default MyAccount;
