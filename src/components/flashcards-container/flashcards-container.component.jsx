import React, { useState } from 'react';
import './flashcards-container.styles.css';

import Flashcard from '../flashcard/flashcard-component';
import NewCardForm from '../newCardForm/newCardForm-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/fontawesome-free-regular';

function FlashcardsContainer(props) {
  const [state, setState] = useState({ ...props });
  const [cardsToggled, setCardsToggled] = useState(false);
  const [formToggled, setFormToggled] = useState(false);

  const { deck, deckNumber, deckName } = state;

  const flashcards = deck.map((card, i) => {
    return (
      <li key={i}>
        <Flashcard cardId={i + 1} front={card.cardFront} back={card.cardBack} />
      </li>
    );
  });
  const form = <NewCardForm />;

  const toggleCards = () => {
    setCardsToggled(() => !cardsToggled);
  };
  const toggleForm = () => {
    setFormToggled(() => !formToggled);
  };

  return (
    <div className="container">
      <h1>
        {deckNumber + 1}: {deckName} ({deck.length} Cards)
      </h1>
      {cardsToggled && <ul>{flashcards}</ul>}
      {formToggled && form}
      <div className="buttons">
        <button onClick={() => props.toggleStudy(deckNumber)}>Study</button>
        <button onClick={toggleCards}>
          {cardsToggled ? 'Hide' : 'Show'} Cards
        </button>
        <button onClick={toggleForm}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
    </div>
  );
}

export default FlashcardsContainer;
