import React from 'react';
import ReactCardFlip from 'react-card-flip';

import './studyFlashcard-styles.css';

// HACK: second component to force rerender in order to not have flip animation switch back on new card. causes flicker on rerender.

function StudyFlashcard(props) {
  const { front, back, isFlipped } = props;

  const flashcardFront = (
    <div className="study-flashcard study-card-front">{front}</div>
  );

  const flashcardBack = (
    <div className="study-flashcard study-card-back">{back}</div>
  );

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {flashcardFront}

      {flashcardBack}
    </ReactCardFlip>
  );
}

export default StudyFlashcard;
