import React, { useState } from 'react';
import axios from 'axios';
import './deck-styles.css';

import Flashcard from '../flashcard/flashcard-component';
import NewCardForm from '../newCardForm/newCardForm-component';
import EditDeckForm from '../editDeckForm/editDeckForm-component';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/fontawesome-free-regular';

function Deck(props) {
  const [cardsToggled, setCardsToggled] = useState(false);
  const [addCardFormToggled, setAddCardFormToggled] = useState(false);
  const [editDeckFormToggled, setEditDeckFormToggled] = useState(false);

  const { deck, deckId, deckNumber, deckName, fetchData } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.delete(
        `http://localhost:8000/api/v1/decks/${deckId}`
      );
      console.log(response);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const flashcards = deck.map((card, i) => {
    return (
      <li key={i}>
        <Flashcard
          cardId={i + 1}
          cardDBId={card._id}
          front={card.cardFront}
          back={card.cardBack}
          fetchData={fetchData}
          mode="show"
        />
      </li>
    );
  });
  const form = <NewCardForm deckId={deckId} fetchData={fetchData} />;

  const toggleCards = () => {
    setCardsToggled(() => !cardsToggled);
  };
  const toggleAddCardForm = () => {
    setAddCardFormToggled(() => !addCardFormToggled);
  };

  const toggleEditDeckForm = () => {
    setEditDeckFormToggled(() => !editDeckFormToggled);
  };

  return (
    <div className="container">
      <h1>
        {deckNumber + 1}: {deckName} ({deck.length} Cards)
      </h1>
      {cardsToggled && <ul>{flashcards}</ul>}
      {addCardFormToggled && form}
      <div className="buttons">
        <button onClick={() => props.toggleStudy(deckNumber)}>Study</button>
        <button onClick={toggleCards}>
          {cardsToggled ? 'Hide' : 'Show'} Cards
        </button>
        <button onClick={toggleAddCardForm}>Add Card</button>
        <button onClick={toggleEditDeckForm}>Edit Deck</button>
        {editDeckFormToggled && (
          <EditDeckForm
            deckId={deckId}
            fetchData={fetchData}
            toggle={toggleEditDeckForm}
          />
        )}
        <form onSubmit={handleSubmit}>
          <button type="submit">Delete Deck</button>
        </form>
      </div>
    </div>
  );
}

export default Deck;
