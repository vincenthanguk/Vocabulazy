import React from 'react';
import './studyFlashcard-styles.css';

function StudyFlashcard(props) {
  const { front, back, reveal } = props;

  const flashcard = (
    <div className="study-flashcard">{reveal ? back : front}</div>
  );

  return flashcard;
}

export default StudyFlashcard;
