import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './deck-styles.css';

import Flashcard from '../flashcard/flashcard-component';
import EditDeckForm from '../editDeckForm/editDeckForm-component';

// deck component displays a deck of flashcards with additional functionality such as deleting a deck, editing a deck, and adding new cards
function Deck(props) {
  const [userContext, setUserContext] = useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [editDeckFormVisible, setEditDeckFormVisible] = useState(false);

  const { deck, deckId, deckNumber, deckName, fetchData, handleFlash } = props;

  // deletes deck from database
  const deleteDeck = async (e) => {
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

  // handles click events on flashcards, either editing an existing card, canceling the new card, or adding a new card.
  const handleEditClick = (i) => {
    if (editingCardIndex === i) {
      setEditingCardIndex(null);
    } else if (editingCardIndex === 'addNewCard ' && i === 'addNewCard') {
      setEditingCardIndex(null);
    } else {
      setEditingCardIndex(i);
    }
  };

  // toggles the visibility of cards in the deck view
  const toggleCardsVisibility = () => {
    setCardsVisible((prevState) => !prevState);
    setEditingCardIndex(null);
  };

  // toggles visibility of edit deck form
  const toggleEditDeckFormVisibility = () => {
    setEditDeckFormVisible((prevState) => !prevState);
    setEditingCardIndex(null);
  };

  // Generates Flshcard components for each card in the deck
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
          isEditing={editingCardIndex === i}
        />
      </li>
    );
  });

  // form for adding new card to the deck
  const form = (
    <li>
      <Flashcard
        initialValue="newCard"
        deckId={deckId}
        fetchData={fetchData}
        handleFlash={handleFlash}
        onEditClick={() => handleEditClick()}
        isEditing={editingCardIndex === 'addNewCard'}
      />
    </li>
  );

  // button for adding new card to deck
  const addCardBtn = (
    <li>
      <div className="add-card-button-container">
        <button onClick={() => handleEditClick('addNewCard')}>⊕</button>
      </div>
    </li>
  );

  return (
    <div className="deck-container">
      <div className="deck-header">
        {/* <div className="deckNumber">{deckNumber + 1}</div> */}
        <button className="deck-delete-button" disabled={isSubmitting}>
          ❌
        </button>
        <div className="deck-name-container">
          <button
            className="deck-delete-button"
            onClick={() => props.toggleStudy(deckNumber)}
            disabled={deck.length === 0}
          >
            {deckName}
          </button>
        </div>
        <button
          onClick={toggleEditDeckFormVisibility}
          className="deck-edit-button"
        >
          ✏️
        </button>
      </div>
      {cardsVisible && (
        <ul className="flashcard-list">
          {flashcards}
          {/* show/hide add card */}
          {editingCardIndex === 'addNewCard' && form}
          {/* add card btn */}
          {editingCardIndex === 'addNewCard' || addCardBtn}
        </ul>
      )}

      <div>
        <button
          onClick={toggleCardsVisibility}
          className={cardsVisible ? 'active' : undefined}
          // disabled={deck.length === 0}
        >
          {deck.length} Cards
          {/* {cardsVisible ? 'Hide' : 'Show'} Cards */}
        </button>
        {editDeckFormVisible && (
          <EditDeckForm
            deckId={deckId}
            fetchData={fetchData}
            toggle={toggleEditDeckFormVisibility}
            handleFlash={handleFlash}
          />
        )}
        <form onSubmit={deleteDeck}></form>
      </div>
    </div>
  );
}

export default Deck;
