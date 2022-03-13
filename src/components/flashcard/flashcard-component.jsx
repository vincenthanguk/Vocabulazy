import React, { useState } from 'react';
import axios from 'axios';
import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
  const { cardId, cardDBId, front, back, fetchData } = props;
  const [isEditingCard, setIsEditingCard] = useState(false);

  const toggleEditCard = () => {
    setIsEditingCard(() => !isEditingCard);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/cards/${cardDBId}`
      );
      console.log(response);
      fetchData();
    } catch (err) {
      console.log(err);
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
        />
      )}

      <button onClick={toggleEditCard}>
        {isEditingCard ? 'X' : 'Edit Card'}
      </button>
      {isEditingCard || <button onClick={handleDelete}>Delete Card</button>}
    </div>
  );

  return flashcard;
}

export default Flashcard;
