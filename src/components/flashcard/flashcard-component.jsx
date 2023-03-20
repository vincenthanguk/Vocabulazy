import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cardId, cardDBId, front, back, fetchData, handleFlash } = props;
  const [isEditingCard, setIsEditingCard] = useState(false);

  const toggleEditCard = () => {
    setIsEditingCard(() => !isEditingCard);
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      await fetch(process.env.REACT_APP_API_ENDPOINT + `cards/${cardDBId}`, {
        method: 'DELETE',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      });
      await fetchData();
      handleFlash('success', 'Card deleted!', 2000);
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };

  const flashcardContent = (
    <>
      <div className="cardNumber">{cardId}</div>
      <div className="cardFront">{front}</div>
      <div className="cardBack">{back}</div>
      <div className="cardBtn editCardBtn" onClick={toggleEditCard}>
        {isSubmitting ? '' : '✏️'}
      </div>

      <div
        className="cardBtn deleteCardBtn"
        onClick={handleDelete}
        disabled={isSubmitting}
      >
        {isSubmitting ? '' : '🗑'}
      </div>
    </>
  );

  const flashcard = (
    <div className={`flashcard ${isSubmitting ? 'deleting' : ''}`}>
      {isEditingCard ? (
        <EditCardForm
          cardId={cardDBId}
          cardFront={front}
          cardBack={back}
          fetchData={fetchData}
          toggle={toggleEditCard}
          handleFlash={handleFlash}
        />
      ) : (
        flashcardContent
      )}
    </div>
  );

  return flashcard;
}

export default Flashcard;
