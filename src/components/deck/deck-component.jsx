import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './deck-styles.css';

import Flashcard from '../flashcard/flashcard-component';
import EditDeckForm from '../editDeckForm/editDeckForm-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

// deck component displays a deck of flashcards with additional functionality such as deleting a deck, editing a deck, and adding new cards
function Deck(props) {
  const {
    deck,
    isDemoDeck,
    isDemoUser,
    deckId,
    deckNumber,
    deckName,
    fetchData,
    handleFlash,
    onAddCard,
    onEditCard,
    onDeleteCard,
    onDeleteDeck,
    onEditDeck,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [editDeckFormVisible, setEditDeckFormVisible] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // deletes deck from database
  const handleDeleteDeck = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      if (isDemoUser) {
        // handle deletion for demo_mode
        onDeleteDeck(deckId);
      } else {
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
      }
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
    console.log('inside handleEditClic', i);
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
          isDemoDeck={isDemoDeck}
          isDemoUser={isDemoUser}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
        />
      </li>
    );
  });

  // form for adding new card to the deck
  const addNewCardForm = (
    <li>
      <Flashcard
        initialValue="newCard"
        deckId={deckId}
        fetchData={fetchData}
        handleFlash={handleFlash}
        onEditClick={() => handleEditClick()}
        isEditing={editingCardIndex === 'addNewCard'}
        isDemoUser={isDemoUser}
        onAddCard={onAddCard}
      />
    </li>
  );

  // button for adding new card to deck
  const addCardBtn = (
    <li>
      <div className="add-card-button-container">
        <button
          onClick={() => handleEditClick('addNewCard')}
          disabled={isSubmitting || isDemoDeck}
        >
          ⊕
        </button>
      </div>
    </li>
  );

  return (
    <div className={`deck-container${isHovered ? ' glow' : ''}`}>
      <div
        className="deck-header"
        onMouseEnter={(e) => {
          setIsHovered(true);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
        }}
      >
        <button
          className={`deck-btn deck-delete-button${
            !isHovered ? ' hidden' : ''
          }`}
          disabled={isSubmitting || isDemoDeck}
          onClick={handleDeleteDeck}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div className="deck-name-container">{deckName}</div>
        <button
          onClick={toggleEditDeckFormVisibility}
          className={`deck-btn deck-edit-button${!isHovered ? ' hidden' : ''}`}
          disabled={isSubmitting || isDemoDeck}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          className="button deck-study-button"
          onClick={() => props.toggleStudy(deckNumber)}
          disabled={deck.length === 0}
        >
          Study
        </button>
      </div>
      {cardsVisible && (
        <ul className="flashcard-list">
          {flashcards}
          {/* show/hide add card */}
          {editingCardIndex === 'addNewCard' && addNewCardForm}
          {/* add card btn */}
          {editingCardIndex === 'addNewCard' || addCardBtn}
        </ul>
      )}

      <div>
        <button
          onClick={toggleCardsVisibility}
          className={`button button-small show-card-btn${
            cardsVisible ? ' active' : ''
          }`}
        >
          {cardsVisible ? 'Hide' : `${deck.length} Cards`}
        </button>
        {editDeckFormVisible && (
          <EditDeckForm
            deckId={deckId}
            fetchData={fetchData}
            toggle={toggleEditDeckFormVisibility}
            handleFlash={handleFlash}
            isDemoUser={isDemoUser}
            onEditDeck={onEditDeck}
            prevDeckName={deckName}
          />
        )}
      </div>
    </div>
  );
}

export default Deck;
