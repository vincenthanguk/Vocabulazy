import React, { useState, useEffect } from 'react';
import Deck from '../deck/deck-component';
import deckData from '../../data/data';
import Study from '../study/study-component';
import NewDeckForm from '../newDeckForm/newDeckForm-component';

import axios from 'axios';

import './grammCracker-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function GrammCracker() {
  const [deck, setDeck] = useState(deckData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [studyDeck, setStudyDeck] = useState(0);

  const toggleStudy = (deckNum) => {
    // toggles study mode on/off, sets deck to be studied so it can be rendered in study view
    setIsStudying(() => !isStudying);
    setStudyDeck(deckNum);
  };

  // fetching data from API upon loading
  useEffect(() => {
    setIsError(false);
    try {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await axios('http://localhost:8000/api/v1/decks');
        // BUG: sets dummy deck from deckData to first deck, fixed?
        setDeck(result.data.data.decks);
        setIsLoading(false);
      };
      fetchData();
    } catch (err) {
      setIsError(true);
      console.error('looks like something went wrong', err);
    }
  }, []);

  const studyView = (
    <Study deck={deck[studyDeck].cards} deckName={deck[studyDeck].name} />
  );

  const deckContainers = deck.map((deck, i) => {
    return (
      <li className="liContainer" key={i}>
        <Deck
          deck={deck.cards}
          deckId={deck._id}
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
      <span>Total Decks: {isLoading ? ' ' : deck.length}</span>
    </>
  );

  const newDeckButton = (
    <button onClick={() => setIsAddingDeck(!isAddingDeck)}>
      {isAddingDeck ? 'X' : 'Add Deck'}
    </button>
  );

  let main;

  if (!isLoading) {
    main = (
      <>
        <div className="GrammCracker">
          {isStudying || heading}
          <div className="mainContainer">
            {isStudying || <ul>{deckContainers}</ul>}
            {isStudying && studyView}
            {isStudying && (
              <button
                className="backbtn"
                onClick={() => toggleStudy(studyDeck)}
              >
                Back to Decks
              </button>
            )}
          </div>
          <div>{isAddingDeck && <NewDeckForm />}</div>
          <div>{newDeckButton}</div>
        </div>
      </>
    );
  } else {
    // loading spinner
    main = <div>Loading Data...</div>;
  }

  return main;
}

//  TODO: toggleStudy requires argument -> more elegant solution?

export default GrammCracker;
