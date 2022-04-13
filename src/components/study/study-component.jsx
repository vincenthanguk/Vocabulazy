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

  // everytime the studydeck is changed, a new random card is selected as currentCard
  const generateRandomCard = () => {
    console.log('generating random card');
    console.log(studyDeck.length);
    const ranNum = Math.floor(Math.random() * studyDeck.length);
    const card = studyDeck[ranNum];

    return card;
  };

  useEffect(() => setCurrentCard(generateRandomCard()), [studyDeck]);

  const cardCorrect = (card) => {
    setCorrect((oldState) => [...oldState, card]);
    removeCard(card);
    // setCurrentCard(generateRandomCard());
    hideCard();
  };

  const cardWrong = (card) => {
    setWrong((oldState) => [...oldState, card]);
    removeCard(card);
    // setCurrentCard(generateRandomCard());
    hideCard();
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
    // if (studyDeck.length > 0) setCurrentCard(generateRandomCard());
  };

  // let ranCard;

  // const generateRandomCard = () => {
  //   console.log('generating random card');
  //   if (studyDeck.length > 0) {
  //     const ranNum = Math.floor(Math.random() * studyDeck.length);
  //     ranCard = studyDeck[ranNum];
  //     const card = (
  //       <StudyFlashcard
  //         cardId={ranCard.cardId}
  //         front={ranCard.cardFront}
  //         back={ranCard.cardBack}
  //         reveal={cardIsRevealed}
  //       />
  //     );
  //     return card;
  //   } else {
  //     return <h1>No Cards left in Deck!</h1>;
  //   }
  // };

  const revealCard = () => {
    setCardIsRevealed(true);
  };
  const hideCard = () => {
    setCardIsRevealed(false);
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
      <div className="card">
        {currentCard ? (
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
