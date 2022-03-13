import React, { useState, useEffect } from 'react';
import Deck from '../deck/deck-component';
// import deckData from '../../data/data';
import Study from '../study/study-component';
import NewDeckForm from '../newDeckForm/newDeckForm-component';

import axios from 'axios';

import './grammCracker-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function GrammCracker() {
  const [deck, setDeck] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [studyDeck, setStudyDeck] = useState(0);

  const toggleStudy = (deckNum) => {
    // toggles study mode on/off, sets deck to be studied so it can be rendered in study view
    setIsStudying(() => !isStudying);
    setStudyDeck(deckNum);
  };

  const fetchData = async () => {
    const result = await axios('http://localhost:8000/api/v1/decks');
    setDeck(result.data.data.decks);
    setIsLoading(false);
  };

  // fetching data from API upon loading
  useEffect(() => {
    setIsError(false);
    try {
      fetchData();
    } catch (err) {
      setIsError(true);
      console.error('looks like something went wrong', err);
    }
  }, []);

  let studyView;
  // conditional rendering in case no decks are loaded from DB
  if (deck.length > 0) {
    studyView = (
      <Study deck={deck[studyDeck].cards} deckName={deck[studyDeck].name} />
    );
  }

  const noDecks = <div>Try adding your first deck!</div>;

  const deckContainers = deck.map((deck, i) => {
    return (
      <li className="liContainer" key={i}>
        <Deck
          deck={deck.cards}
          deckId={deck._id}
          deckNumber={i}
          deckName={deck.name}
          toggleStudy={toggleStudy}
          fetchData={fetchData}
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
      <span>Total Decks: {isLoading ? 'loading...' : deck.length}</span>
    </>
  );

  const newDeckButton = (
    <button onClick={() => setIsAddingDeck(!isAddingDeck)}>
      {isAddingDeck ? 'X' : 'Add Deck'}
    </button>
  );

  const mainContainer = (
    <>
      <div className="mainContainer">
        {/* display deckcontainers when not in study mode */}
        {isStudying || <ul>{deckContainers}</ul>}
        {/* display studyview when in study mode */}
        {isStudying && studyView}
        {deck.length > 0 || noDecks}
        {isStudying && (
          <button className="backbtn" onClick={() => toggleStudy(studyDeck)}>
            Back to Decks
          </button>
        )}
      </div>
      <div>{isAddingDeck && <NewDeckForm fetchData={fetchData} />}</div>
      <div>{newDeckButton}</div>
    </>
  );

  const loading = <div>Loading Decks...</div>;

  return (
    <>
      <div className="GrammCracker">
        {isStudying || heading}
        {isLoading ? loading : mainContainer}
      </div>
    </>
  );
}

export default GrammCracker;
