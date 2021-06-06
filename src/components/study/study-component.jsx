import React from 'react';
import Flashcard from '../flashcard/flashcard.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

import './study-styles.css';

function Study(props) {
  const { deck, deckName } = props;
  const ranCardIndex = Math.floor(Math.random() * deck.length);
  const ranCard = deck[ranCardIndex];
  const randomCard = (
    <Flashcard
      cardId={ranCard.cardId}
      front={ranCard.cardFront}
      back={ranCard.cardBack}
    />
  );

  //   NOTE: need card counter, stack for correct, wrong cards. show only front of card, back upon button press

  console.log(ranCardIndex, deck[ranCardIndex]);

  return (
    <div className="Study">
      <h1>STUDY MODE</h1>
      <p>Current Deck: {deckName}</p>
      <p>Card 1/{deck.length}</p>
      <ul>{randomCard}</ul>
      <div className="buttons">
        <button>
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button>
          <FontAwesomeIcon icon={faQuestion} />
        </button>
      </div>
    </div>
  );
}

export default Study;
