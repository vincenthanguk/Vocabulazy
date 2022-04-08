import React, { useState } from 'react';
import axios from 'axios';
import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
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
      const response = await axios.delete(
        `http://localhost:8000/api/v1/cards/${cardDBId}`
      );
      console.log(response);
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
