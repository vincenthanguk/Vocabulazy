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
  const [studyDeck, setStudyDeck] = useState(0);

  const toggleStudy = (deckNum) => {
    // toggles study mode on/off, sets deck to be studied so it can be rendered in study view
    setStudyToggled(() => !studyToggled);
    setStudyDeck(deckNum);
  };

  const studyView = (
    <Study deck={deck[studyDeck].cards} deckName={deck[studyDeck].name} />
  );

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

  const heading = (
    <>
      <h1>
        Gramm-Cracker <FontAwesomeIcon icon={faCookieBite} />
      </h1>
      <span>Your Daily Bite of Grammar</span>
      <span>Total Decks: {deck.length}</span>
    </>
  );

  return (
    <div className="GrammCracker">
      {studyToggled || heading}
      <div className="mainContainer">
        {studyToggled || <ul>{deckContainers}</ul>}
        {studyToggled && studyView}
        {studyToggled && (
          <button className="backbtn" onClick={() => toggleStudy(studyDeck)}>
            Back to Decks
          </button>
        )}
      </div>
    </div>
  );
}

//  TODO: toggleStudy requires argument -> more elegant solution?

export default GrammCracker;
