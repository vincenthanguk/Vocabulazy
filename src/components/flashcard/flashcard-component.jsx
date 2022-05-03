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
      <h3>Card #{cardId}</h3>
      <h3>Front: {front}</h3>
      <h3>Back: {back}</h3>
    </>
  );

  const flashcard = (
    <div className="flashcard">
      {!isEditingCard && flashcardContent}
      {isEditingCard && (
        <EditCardForm
          cardId={cardDBId}
          fetchData={fetchData}
          toggle={toggleEditCard}
          handleFlash={handleFlash}
        />
      )}
      <button onClick={toggleEditCard}>
        {isEditingCard ? 'X' : 'Edit Card'}
      </button>
      {isEditingCard || (
        <button onClick={handleDelete} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting...' : 'Delete Card'}
        </button>
      )}
    </div>
  );

  return flashcard;
}

export default Flashcard;
