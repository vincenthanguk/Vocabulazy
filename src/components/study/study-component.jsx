import React, { useState, useEffect } from 'react';
import StudyFlashcard from '../studyFlashcard/studyFlashcard-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import './study-styles.css';

function Study(props) {
  const { deck, deckName } = props;

  const [studyDeck, setStudyDeck] = useState(deck);
  const [currentCard, setCurrentCard] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [cardIsRevealed, setCardIsRevealed] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(true);

  // everytime the studydeck is changed, a new random card is selected as currentCard
  const generateRandomCard = () => {
    console.log('generating random card');
    console.log(studyDeck.length);
    const ranNum = Math.floor(Math.random() * studyDeck.length);
    const card = studyDeck[ranNum];

    return card;
  };

  useEffect(() => setCurrentCard(generateRandomCard()), [studyDeck]);

  useEffect(() => {
    let interval = null;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!timerIsActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, timerSeconds]);

  const checkFinish = () => {
    if (studyDeck.length > 1) {
      console.log(studyDeck.length);
    } else {
      console.log('deactivating timer');
      setTimerIsActive(false);
    }
  };

  const cardCorrect = (card) => {
    setCorrect((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
    checkFinish();
  };

  const cardWrong = (card) => {
    setWrong((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
    checkFinish();
  };

  const removeCard = (card) => {
    setStudyDeck(studyDeck.filter((item) => item._id !== card._id));
    console.log('removing card from deck');
    // console.log(studyDeck, card);
  };

  const resetDecks = () => {
    setStudyDeck(deck);
    setCorrect([]);
    setWrong([]);
    hideCard();
    setTimerSeconds(0);
    setTimerIsActive(true);
  };

  const revealCard = () => {
    setCardIsRevealed(true);
  };

  const hideCard = () => {
    setCardIsRevealed(false);
  };

  return (
    <div className="Study">
      <h1>Studying Deck "{deckName}"</h1>
      <div className="overview">
        <table>
          <tbody>
            <tr>
              <td>⏱: {timerSeconds}</td>
              <td>🗂: {studyDeck.length}</td>
              <td>✅: {correct.length}</td>
              <td>❌: {wrong.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        {currentCard && timerIsActive ? (
          <StudyFlashcard
            cardId={currentCard.cardId}
            front={currentCard.cardFront}
            back={currentCard.cardBack}
            reveal={cardIsRevealed}
          />
        ) : (
          'Finished Deck!'
        )}
      </div>
      <div className="buttons">
        {!cardIsRevealed && currentCard && (
          <button onClick={() => revealCard()}>Show!</button>
        )}
        {cardIsRevealed && (
          <>
            <button onClick={() => cardCorrect(currentCard)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={() => cardWrong(currentCard)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </>
        )}
        {!currentCard && (
          <button onClick={() => resetDecks()}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Study;
