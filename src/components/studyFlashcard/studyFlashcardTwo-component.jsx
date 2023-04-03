import React from 'react';
import ReactCardFlip from 'react-card-flip';

import './studyFlashcard-styles.css';

// HACK: second component to force rerender in order to not have flip animation switch back on new card. causes flicker on rerender.

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

function StudyFlashcard(props) {
  const { front, back, isFlipped } = props;

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
