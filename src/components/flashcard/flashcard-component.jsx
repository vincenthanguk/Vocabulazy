import React, { useState } from 'react';
import EditCardForm from '../editCardForm/editCardForm-component';
import './flashcard-styles.css';

function Flashcard(props) {
  const { cardId, cardDBId, front, back, fetchData } = props;
  const [isEditingCard, setIsEditingCard] = useState(false);

  const toggleEditCard = () => {
    setIsEditingCard(() => !isEditingCard);
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
        <EditCardForm cardId={cardDBId} fetchData={fetchData} />
      )}

      <button onClick={toggleEditCard}>Edit Card</button>
      <button>Delete Card</button>
    </div>
  );

  return (
    <>
      {flashcard}
      {/* {isEditingCard && <EditCardForm />} */}
    </>
  );
}

export default Flashcard;
