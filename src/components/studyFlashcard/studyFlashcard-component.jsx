import React from 'react';
import './studyFlashcard-styles.css';

function StudyFlashcard(props) {
  const { front, back, reveal } = props;

  const flashcard = (
    <>
      <h3>Front: {front}</h3>
      <h3>Back: {reveal ? back : ''}</h3>
    </>
  );

  return flashcard;
}

export default StudyFlashcard;
