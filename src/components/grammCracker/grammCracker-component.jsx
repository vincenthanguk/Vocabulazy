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
      <li className="liContainer" key={i}>
        <FlashcardsContainer
          deck={deck.cards}
          deckNumber={i}
          deckName={deck.name}
          toggleStudy={toggleStudy}
        />
      </li>
    );
  });

  // TODO: pass up deck number and put into Study component

  return (
    <div className="GrammCracker">
      <h1>
        Gramm-Cracker <FontAwesomeIcon icon={faCookieBite} />
      </h1>
      {studyToggled || <p>Number of Decks: {deck.length}</p>}
      <div className="mainContainer">
        {studyToggled || <ul>{deckContainers}</ul>}
        {studyToggled && <Study deck={deck[0].cards} deckName={deck[0].name} />}
        {studyToggled && (
          <button className="backbtn" onClick={toggleStudy}>
            Back to Decks
          </button>
        )}
      </div>
    </div>
  );
}

export default GrammCracker;
