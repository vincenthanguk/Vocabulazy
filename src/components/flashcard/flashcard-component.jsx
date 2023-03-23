import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hidden, setHidden] = useState(true);
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
    toggleAddCardForm,
    closeAddCardForm,
    onEditClick,
    isEditing,
  } = props;

  useEffect(() => {
    if (initialValue === 'newCard') {
      setIsEditingCard(true);
    }
  }, [initialValue]);

  // should only toggle for existing cards, new cards should return to + state on click
  const toggleEditCard = () => {
    console.log('inside toggleEditCard');
    setIsEditingCard(() => !isEditingCard);
    closeAddCardForm();
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
      <button
        className={`emojiBtn cardBtn editCardBtn ${hidden && 'hidden'}`}
        onClick={onEditClick}
        disabled={isSubmitting}
      >
        ✏️
      </button>

      <button
        className={`emojiBtn cardBtn deleteCardBtn ${hidden && 'hidden'}`}
        onClick={handleDelete}
        disabled={isSubmitting}
      >
        ❌
      </button>
    </>
  );

  const flashcard = (
    <div
      className={`flashcard ${isSubmitting ? 'deleting' : ''}
    ${initialValue === 'newCard' || !hidden ? 'glow' : ''}`}
      onMouseEnter={(e) => {
        setHidden(false);
      }}
      onMouseLeave={(e) => {
        setHidden(true);
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
          toggle={toggleEditCard}
          setSubmitInParent={setIsSubmitting}
          isSubmitting={isSubmitting}
          handleFlash={handleFlash}
          isEditingCard={isEditingCard}
          initialValue={initialValue}
          toggleAddCardForm={toggleAddCardForm}
          onEditClick={onEditClick}
        />
      ) : (
        flashcardContent
      )}
    </div>
  );

  return flashcard;
}

export default Flashcard;
