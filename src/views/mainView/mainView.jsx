import React, { useState } from 'react';

import Welcome from '../../components/welcome/welcome-component';
import Deck from '../../components/deck/deck-component';
import EditDeckForm from '../../components/editDeckForm/editDeckForm-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import {
  handleAddDeck,
  handleDeleteDeck,
  handleEditDeck,
  handleAddCardToDeck,
  handleEditCard,
  handleDeleteCard,
} from '../../utils/handlers.js';

function MainView(props) {
  const {
    setView,
    isLoading,
    onToggleAccountPage,
    isDemoUser,
    fetchData,
    handleFlash,
    userContext,
    deckList,
    setDeckList,
    setStudyDeck,
  } = props;

  const [editingDeckIndex, setEditingDeckIndex] = useState(null);

  // handles click events on decks, either editing an existing deck, canceling the new deck, or adding a new deck
  const handleDeckEditClick = (i) => {
    console.log('inside handleEditCliccccc', i);
    if (editingDeckIndex === i) {
      setEditingDeckIndex(null);
    } else if (editingDeckIndex === 'addNewDeck ' && i === 'addNewDeck') {
      setEditingDeckIndex(null);
    } else {
      setEditingDeckIndex(i);
    }
  };

  // toggle study mode on/off, sets deck to be studied so it can be rendered in study view
  const toggleStudy = (deckNum) => {
    setView('studyView');
    setStudyDeck(deckNum);
  };

  // ------------ DEMOMODE CRUD OPERATIONS ------------

  const handleAddDeckWrapper = (user, deckName) => {
    handleAddDeck(deckList, setDeckList, user, deckName);
  };

  const handleDeleteDeckWrapper = (deckId) => {
    handleDeleteDeck(deckList, setDeckList, deckId);
  };

  const handleEditDeckWrapper = (deckId, deckName) => {
    handleEditDeck(deckList, setDeckList, deckId, deckName);
  };

  const handleAddCardToDeckWrapper = (data) => {
    handleAddCardToDeck(deckList, setDeckList, data);
  };

  const handleEditCardWrapper = (data) => {
    handleEditCard(deckList, setDeckList, data);
  };

  const handleDeleteCardWrapper = (deckId, cardId) => {
    handleDeleteCard(deckList, setDeckList, deckId, cardId);
  };

  const heading = (
    <div className="heading-container">
      <div className="heading-subheading">Let's be Vocabulazy today</div>
      <div className="heading-username">Hi {userContext.username}!</div>
      {userContext.token ? (
        <div className="avatar-container">
          <Welcome className="Welcome" toggle={onToggleAccountPage} />
        </div>
      ) : null}
      <div className="darkmode-container">
        <FontAwesomeIcon icon={faBars} />
      </div>
    </div>
  );

  const loading = <div>Loading Decks...</div>;

  const noDecks = <div>Try adding your first deck!</div>;

  const deckContainers = deckList.map((deck, i) => {
    return (
      <li className="list-container" key={i}>
        <Deck
          deck={deck.cards}
          deckId={deck._id}
          deckNumber={i}
          deckName={deck.name}
          isDemoDeck={deck.demo}
          isDemoUser={isDemoUser}
          toggleStudy={toggleStudy}
          fetchData={fetchData}
          handleFlash={handleFlash}
          onAddCard={handleAddCardToDeckWrapper}
          onEditCard={handleEditCardWrapper}
          onDeleteCard={handleDeleteCardWrapper}
          onDeleteDeck={handleDeleteDeckWrapper}
          onEditDeck={handleEditDeckWrapper}
          editDeckFormVisible={editingDeckIndex === i}
          onDeckEditClick={handleDeckEditClick}
        />
      </li>
    );
  });

  const mainContainer = (
    <div className="main-container">
      <ul className="deck-list">
        {deckContainers}
        <li className="list-container">
          <EditDeckForm
            fetchData={fetchData}
            onFlash={handleFlash}
            toggle={handleDeckEditClick}
            isDemoUser={isDemoUser}
            isAddingDeck={editingDeckIndex === 'addNewDeck'}
            onAddDeck={handleAddDeckWrapper}
            initialValue="newDeck"
          />
        </li>
      </ul>
      {deckList.length > 0 || noDecks}
    </div>
  );

  return (
    <div className="MainView">
      <div className="header-main">{heading}</div>
      {isLoading ? loading : mainContainer}
      {!userContext.token && 'No User Token'}
    </div>
  );
}

export default MainView;
