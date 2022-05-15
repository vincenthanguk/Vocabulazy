import React from 'react';
import './myAccount-styles.css';

const MyAccount = (props) => {
  const { toggle, deckData, userDetails } = props;

  const calculateTotalCards = (decks) => {
    let cardSum = 0;
    decks.forEach((deck) => {
      cardSum += deck.cards.length;
    });
    return cardSum;
  };

  const convertDateString = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  return (
    <div className="modal" onClick={toggle}>
      <div className="modal-main">
        <button onClick={toggle}>X</button>
        <h1>
          {userDetails.firstName} {userDetails.lastName}
        </h1>
        <span>
          (Crackin' Gramms since {convertDateString(userDetails.createdAt)}){' '}
        </span>
        <h2>Statistics</h2>
        <p>Total Decks: {deckData.length}</p>
        <p>Total Cards: {calculateTotalCards(deckData)}</p>
        <p>Study Sessions: {userDetails.studySessions} </p>
        <button>Delete Account</button>
      </div>
    </div>
  );
};

export default MyAccount;
