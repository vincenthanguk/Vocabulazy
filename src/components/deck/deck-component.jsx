import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './deck-styles.css';

import Flashcard from '../flashcard/flashcard-component';
import EditDeckForm from '../editDeckForm/editDeckForm-component';

function Deck(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardsToggled, setCardsToggled] = useState(false);
  const [addCardFormToggled, setAddCardFormToggled] = useState(false);
  const [editDeckFormToggled, setEditDeckFormToggled] = useState(false);

  const { deck, deckId, deckNumber, deckName, fetchData, handleFlash } = props;

  // deletes decks from database
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      await fetch(process.env.REACT_APP_API_ENDPOINT + `decks/${deckId}`, {
        method: 'DELETE',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      await fetchData();
      handleFlash('success', 'Deck deleted!', 2000);
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };

  // shows and hides cards in deck view
  const toggleCards = () => {
    setCardsToggled(() => !cardsToggled);
  };

  // shows and hides add new card
  const toggleAddCardForm = () => {
    setAddCardFormToggled(() => !addCardFormToggled);
  };

  // FIXME: shows edit deck form, -> edit deck right up in deck view 1: _________ ✅ delete button in top right corner
  const toggleEditDeckForm = () => {
    setEditDeckFormToggled(() => !editDeckFormToggled);
  };

  // iterate over decks to generate flashcard components
  const flashcards = deck.map((card, i) => {
    return (
      <li key={i}>
        <Flashcard
          cardId={i + 1}
          cardDBId={card._id}
          front={card.cardFront}
          back={card.cardBack}
          deckId={deckId}
          fetchData={fetchData}
          handleFlash={handleFlash}
        />
      </li>
    );
  });

  // FIXME: this should not be an extra component, but a flashcard w/ edit mode within deck view that gets toggled by toggleAddCardForm()
  const form = (
    <li>
      <Flashcard
        initialValue="newCard"
        deckId={deckId}
        fetchData={fetchData}
        handleFlash={handleFlash}
        toggleAddCardForm={toggleAddCardForm}
      />
    </li>
  );

  return (
    <div className="container-deck">
      <h1>
        {deckNumber + 1}: {deckName} ({deck.length} Cards)
      </h1>
      {cardsToggled && (
        <ul className="flashcardUl">
          {flashcards}
          {/* show/hide add card */}
          {addCardFormToggled && form}
          <li>
            <div className="addCardBtn">
              <button
                onClick={toggleAddCardForm}
                className={addCardFormToggled ? 'hidden' : ''}
              >
                ⊕
              </button>
            </div>
          </li>
        </ul>
      )}
      <div className="buttons">
        <button
          onClick={() => props.toggleStudy(deckNumber)}
          disabled={deck.length === 0}
        >
          Study
        </button>
        <button
          onClick={toggleCards}
          className={cardsToggled ? 'active' : undefined}
          disabled={deck.length === 0}
        >
          {cardsToggled ? 'Hide' : 'Show'} Cards
        </button>

        <button
          onClick={toggleEditDeckForm}
          className={editDeckFormToggled ? 'active' : undefined}
        >
          Edit Deck
        </button>
        {editDeckFormToggled && (
          <EditDeckForm
            deckId={deckId}
            fetchData={fetchData}
            toggle={toggleEditDeckForm}
            handleFlash={handleFlash}
          />
        )}
        <form onSubmit={handleSubmit}>
          <button disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : 'Delete Deck'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Deck;
