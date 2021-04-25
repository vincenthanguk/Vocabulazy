import React from 'react';
import './flashcard.styles.css';

function Flashcard(props) {
  const { cardId, front, back } = props;

  return (
    <div className="flashcard">
      <h3>Card #{cardId}</h3>
      <h3>Front: {front}</h3>
      <h3>Back: {back}</h3>
    </div>
  );
}

export default Flashcard;
