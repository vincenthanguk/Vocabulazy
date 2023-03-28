import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const {
    cardId,
    cardDBId,
    deckId,
    front,
    back,
    fetchData,
    handleFlash,
    initialValue,
    onEditClick,
    onAddCard,
    isEditing,
    isDemoDeck,
    isDemoUser,
  } = props;

  useEffect(() => {
    if (initialValue === 'newCard') {
      setIsEditingCard(true);
    }
  }, [initialValue]);

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
      <div className="card-number">{cardId}</div>
      <div className="card-front">{front}</div>
      <div className="card-back">{back}</div>
      <button
        className={`emoji-btn card-btn edit-card-btn ${isHidden && 'hidden'}`}
        onClick={onEditClick}
        disabled={isSubmitting || isDemoDeck}
      >
        ✏️
      </button>

      <button
        className={`emoji-btn card-btn delete-card-btn ${isHidden && 'hidden'}`}
        onClick={handleDelete}
        disabled={isSubmitting || isDemoDeck}
      >
        ❌
      </button>
    </>
  );

  const flashcard = (
    <div
      className={`flashcard ${isSubmitting ? 'deleting' : ''}
    ${initialValue === 'newCard' || !isHidden ? 'glow' : ''}`}
      onMouseEnter={(e) => {
        setIsHidden(false);
      }}
      onMouseLeave={(e) => {
        setIsHidden(true);
      }}
    >
      {isEditing ? (
        <EditCardForm
          cardId={cardDBId}
          cardNumber={cardId}
          cardFront={front}
          cardBack={back}
          deckId={deckId}
          fetchData={fetchData}
          setSubmitInParent={setIsSubmitting}
          isSubmitting={isSubmitting}
          handleFlash={handleFlash}
          isEditingCard={isEditingCard}
          initialValue={initialValue}
          onEditClick={onEditClick}
          onAddCard={onAddCard}
          isDemoUser={isDemoUser}
        />
      ) : (
        flashcardContent
      )}
    </div>
  );

  return flashcard;
}

export default Flashcard;
