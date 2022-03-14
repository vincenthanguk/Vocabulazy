import React, { useState, useEffect } from 'react';
import Flashcard from '../flashcard/flashcard-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import './study-styles.css';

function Study(props) {
  const { deck, deckName } = props;
  const [studyDeck, setStudyDeck] = useState(deck);
  const [correct, setCorrect] = useState([]);
  const [wrong, setWrong] = useState([]);

  const cardCorrect = (card) => {
    setCorrect((oldState) => [...oldState, card]);
    removeCard(card);
  };

  const cardWrong = (card) => {
    setWrong((oldState) => [...oldState, card]);
    removeCard(card);
  };

  const removeCard = (card) => {
    setStudyDeck(studyDeck.filter((item) => item._id !== card._id));
    console.log(studyDeck, card);
  };

  const resetDecks = () => {
    setStudyDeck(deck);
    setCorrect([]);
    setWrong([]);
  };

  let ranCard;

  const generateRandomCard = () => {
    if (studyDeck.length > 0) {
      const ranNum = Math.floor(Math.random() * studyDeck.length);
      ranCard = studyDeck[ranNum];
      const card = (
        <Flashcard
          cardId={ranCard.cardId}
          front={ranCard.cardFront}
          back={ranCard.cardBack}
        />
      );
      return card;
    } else {
      return <h1>No Cards left in Deck!</h1>;
    }
  };

  //   NOTE: need card counter, stack for correct, wrong cards. show only front of card, back upon button press

  return (
    <div className="Study">
      <h1>Studying Deck "{deckName}"</h1>
      <div className="overview">
        <table>
          <tbody>
            <tr>
              <td>🗂: {studyDeck.length}</td>
              <td>✅: {correct.length}</td>
              <td>❌: {wrong.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">{generateRandomCard()}</div>
      <div className="buttons">
        <button onClick={() => cardCorrect(ranCard)}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button onClick={() => cardWrong(ranCard)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button>
          <FontAwesomeIcon icon={faQuestion} />
        </button>
        <button onClick={() => resetDecks()}>
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>
    </div>
  );
}

export default Study;
