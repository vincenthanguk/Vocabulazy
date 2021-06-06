import React, { useState } from 'react';
import FlashcardsContainer from '../flashcards-container/flashcards-container.component';
import deckData from '../../data/data';
import Study from '../study/study-component';

import './grammCracker-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function GrammCracker() {
  const [deck, setDeck] = useState(deckData);
  const [studyToggled, setStudyToggled] = useState(false);

  const toggleStudy = () => {
    setStudyToggled(() => !studyToggled);
  };

  const deckContainers = deck.map((deck, i) => {
    return (
      <li key={i}>
        <FlashcardsContainer
          deck={deck.cards}
          deckNumber={i}
          deckName={deck.name}
          toggleStudy={toggleStudy}
        />
      </li>
    );
  });

  return (
    <div className="GrammCracker">
      <h1>
        Gramm-Cracker <FontAwesomeIcon icon={faCookieBite} />
      </h1>
      <span>Your Daily Dose of Grammar</span>
      <p>{studyToggled || `Number of Decks: ${deck.length}`}</p>
      <div className="mainContainer">
        <ul>{studyToggled || deckContainers}</ul>
        {studyToggled && <Study deck={deck[0].cards} deckName={deck[0].name} />}
        {studyToggled && <button onClick={toggleStudy}>Back to Decks</button>}
      </div>
    </div>
  );
}

export default GrammCracker;
