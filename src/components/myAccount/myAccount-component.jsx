import React from 'react';
import './myAccount-styles.css';

const MyAccount = (props) => {
  const { toggle } = props;

  return (
    <div className="modal">
      <div className="modal-main">
        <h1>My Account</h1>
        <h2>Joined in:</h2>
        <h2>Statistics</h2>
        <p>Total Cards</p>
        <p>Total Decks</p>
        <p>Study Sessions</p>
        <button onClick={toggle}>X</button>
      </div>
    </div>
  );
};

export default MyAccount;
