import React, { useState, useEffect } from 'react';
import Deck from '../deck/deck-component';
// import deckData from '../../data/data';
import Login from '../login/login';
import Study from '../study/study-component';
import NewDeckForm from '../newDeckForm/newDeckForm-component';
import FlashMessage from '../flashMessage/flashMessage-component';

import axios from 'axios';

import './grammCracker-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function GrammCracker() {
  const [deck, setDeck] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [studyDeck, setStudyDeck] = useState(0);
  const [isShowingFlash, setIsShowingFlash] = useState(false);
  const [flash, setFlash] = useState({ message: '', style: '' });

  // toggle study mode on/off, sets deck to be studied so it can be rendered in study view
  const toggleStudy = (deckNum) => {
    setIsStudying(() => !isStudying);
    setStudyDeck(deckNum);
    setIsAddingDeck(false);
  };

  const fetchData = async () => {
    console.log('fetching data...');
    const result = await axios('http://localhost:8000/api/v1/decks');
    setDeck(result.data.data.decks);
    setIsLoading(false);
  };

  // fetching data from API upon loading
  useEffect(() => {
    let controller = new AbortController();
    setIsError(false);
    (async () => {
      try {
        // fetchData();
        const result = await axios('http://localhost:8000/api/v1/decks', {
          signal: controller.signal,
        });
        setDeck(result.data.data.decks);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        console.error('looks like something went wrong', err);
      }
    })();
    return () => controller?.abort();
  }, []);

  const checkFlash = (status, message) => {
    const flash = {};
    flash.message = message;

    if (status === 'success') flash.style = 'flashMessage green';
    if (status === 'error') flash.style = 'flashMessage red';

    return flash;
  };

  // flash message
  const handleFlash = (status, message, flashTime) => {
    setIsShowingFlash(true);
    setFlash(checkFlash(status, message));
    setTimeout(() => {
      setIsShowingFlash(false);
    }, flashTime);
  };

  const toggleNewDeckForm = () => {
    setIsAddingDeck(!isAddingDeck);
  };

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
          handleFlash={handleFlash}
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
      {isLoggedIn && (
        <span>Total Decks: {isLoading ? 'loading...' : deck.length}</span>
      )}
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
      <div>
        {isStudying ||
          (isAddingDeck && (
            <NewDeckForm
              fetchData={fetchData}
              handleFlash={handleFlash}
              toggle={toggleNewDeckForm}
            />
          ))}
      </div>
      <div>{isStudying || newDeckButton}</div>
    </>
  );

  const loading = <div>Loading Decks...</div>;

  return (
    <>
      {isShowingFlash && <FlashMessage flash={flash} />}
      <div className="GrammCracker">
        {heading}
        {isLoggedIn ? (
          <>{isLoading ? loading : mainContainer}</>
        ) : (
          <>
            <div className="mainContainer">
              <Login handleFlash={handleFlash} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default GrammCracker;
