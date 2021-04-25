import React from 'react';
import './flashcard.styles.css';

function Flashcard(props) {
  const { cardId, front, back, removeCard } = props;

  return (
    <div className="flashcard">
      <h3>Card #{cardId + 1}</h3>
      <h3>Front: {front}</h3>
      <h3>Back: {back}</h3>
      <button onClick={() => removeCard(cardId)}>Delete Card</button>
    </div>
  );
}

export default Flashcard;
