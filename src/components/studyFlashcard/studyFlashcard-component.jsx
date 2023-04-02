import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';

import './studyFlashcard-styles.css';

function StudyFlashcard(props) {
  const { front, back } = props;
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcardFront = (
    <div className="study-flashcard study-card-front">{front}</div>
  );

  const flashcardBack = (
    <div className="study-flashcard study-card-back">{back}</div>
  );

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {flashcardFront}

        {flashcardBack}
      </ReactCardFlip>
      <button onClick={handleClick}></button>
    </div>
  );
}

export default StudyFlashcard;
