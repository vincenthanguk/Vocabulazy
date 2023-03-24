import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './deck-styles.css';

import Flashcard from '../flashcard/flashcard-component';
import EditDeckForm from '../editDeckForm/editDeckForm-component';

function Deck(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardsToggled, setCardsToggled] = useState(false);
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);

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

  // Clicked flashcard is already being edited or new card is being cancelled, switch back to normal view
  // Click on + button activates new card view
  // Clicked flashcard is not being edited, switch to edit view
  const handleEditClick = (i) => {
    if (currentlyEditingIndex === i) {
      setCurrentlyEditingIndex(null);
    } else if (currentlyEditingIndex === 'addNewCard ' && i === 'addNewCard') {
      setCurrentlyEditingIndex(null);
    } else {
      setCurrentlyEditingIndex(i);
    }
  };

  // shows and hides cards in deck view
  const toggleCards = () => {
    setCardsToggled(() => !cardsToggled);
  };

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
          onEditClick={() => handleEditClick(i)}
          isEditing={currentlyEditingIndex === i}
        />
      </li>
    );
  });

  const form = (
    <li>
      <Flashcard
        initialValue="newCard"
        deckId={deckId}
        fetchData={fetchData}
        handleFlash={handleFlash}
        onEditClick={() => handleEditClick()}
        isEditing={currentlyEditingIndex === 'addNewCard'}
      />
    </li>
  );

  const addCardBtn = (
    <li>
      <div className="addCardBtn">
        <button onClick={() => handleEditClick('addNewCard')}>⊕</button>
      </div>
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
          {currentlyEditingIndex === 'addNewCard' && form}
          {/* add card btn */}
          {currentlyEditingIndex === 'addNewCard' || addCardBtn}
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
