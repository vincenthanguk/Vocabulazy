import { React, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './myAccount-styles.css';

const MyAccount = (props) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toggle, deckData, userDetails, handleFlash } = props;

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

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      await fetch(process.env.REACT_APP_API_ENDPOINT + `users/me`, {
        method: 'DELETE',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      }).then(async (response) => {
        setUserContext((oldValues) => {
          return { ...oldValues, details: undefined, token: null };
        });
        window.localStorage.setItem('logout', Date.now());
      });
      // await fetchData();
      handleFlash(
        'success',
        'User deleted! Thank you for using Gramm-Cracker',
        2000
      );
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
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
        <button onClick={handleDelete} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting Account...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
