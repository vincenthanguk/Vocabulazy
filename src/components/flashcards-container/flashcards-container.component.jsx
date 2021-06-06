import React, { useState } from 'react';
import './flashcards-container.styles.css';

import Flashcard from '../flashcard/flashcard.component';
import Form from '../form/form-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/fontawesome-free-regular';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function FlashcardsContainer(props) {
  const [state, setState] = useState({ ...props });
  const [cardsToggled, setCardsToggled] = useState(false);
  const [formToggled, setFormToggled] = useState(false);

  const { deck, deckNumber, deckName } = state;

  const flashcards = deck.map((card, i) => {
    return (
      <li key={i}>
        <Flashcard cardId={i} front={card.cardFront} back={card.cardBack} />
      </li>
    );
  });
  const form = <Form />;

  const toggleCards = () => {
    setCardsToggled(() => !cardsToggled);
  };
  const toggleForm = () => {
    setFormToggled(() => !formToggled);
  };

  return (
    <div className="container">
      <h1>
        Deck #{deckNumber + 1} "{deckName}" ({deck.length} Cards)
      </h1>
      <ul>{cardsToggled && flashcards}</ul>
      {formToggled && form}
      <div className="buttons">
        <button>Study</button>
        <button onClick={toggleCards}>
          {cardsToggled ? 'Hide' : 'Show'} Cards
        </button>
        <button onClick={toggleForm}>
          {formToggled ? 'Hide' : 'Show'} Edit
        </button>
      </div>
    </div>
  );
}

export default FlashcardsContainer;
