import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Flashcard(props) {
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
    onEditCard,
    onDeleteCard,
    isEditing,
    isDemoDeck,
    isDemoUser,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);

  useEffect(() => {
    if (initialValue === 'newCard') {
      setIsEditingCard(true);
    }
  }, [initialValue]);

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      // edit deck in local state in demo mode
      if (isDemoUser) {
        onDeleteCard(deckId, cardDBId);
      } else {
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
      }
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
        className={`card-btn edit-card-btn ${isHovered || 'hidden'}`}
        onClick={onEditClick}
        disabled={isSubmitting || isDemoDeck}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>

      <button
        className={`card-btn delete-card-btn ${isHovered || 'hidden'}`}
        onClick={handleDelete}
        disabled={isSubmitting || isDemoDeck}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );

  const flashcard = (
    <div
      className={`flashcard ${isSubmitting ? 'deleting' : ''}
    ${initialValue === 'newCard' || isHovered ? 'highlight' : ''}`}
      onMouseEnter={(e) => {
        setIsHovered(true);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
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
          onEditCard={onEditCard}
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
