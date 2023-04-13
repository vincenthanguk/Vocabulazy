import React from 'react';
import ReactCardFlip from 'react-card-flip';

import './studyFlashcard-styles.css';

function StudyFlashcard(props) {
  const { front, back, isFlipped } = props;

  // calculate font size based on text length
  function calculateFontSize(textLength) {
    if (textLength < 5) {
      return '10rem';
    } else if (textLength < 10) {
      return '6rem';
    } else if (textLength < 15) {
      return '4rem';
    } else {
      return '2rem';
    }
  }

  const flashcardFront = (
    <div
      style={{ fontSize: front && calculateFontSize(front.length) }}
      className="study-flashcard study-card-front"
    >
      {front}
    </div>
  );

  const flashcardBack = (
    <div
      style={{ fontSize: back && calculateFontSize(back.length) }}
      className="study-flashcard study-card-back"
    >
      {back}
    </div>
  );

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {flashcardFront}

      {flashcardBack}
    </ReactCardFlip>
  );
}

export default StudyFlashcard;
