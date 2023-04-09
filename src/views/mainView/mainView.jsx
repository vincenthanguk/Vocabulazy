import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Welcome from '../../components/welcome/welcome-component';
import Deck from '../../components/deck/deck-component';
import EditDeckForm from '../../components/editDeckForm/editDeckForm-component';
import DropdownMenu from '../../components/dropdownMenu/dropdownMenu-component';
import LoadingSpinner from '../../components/loadingSpinner/loadingSpinner-component';

import { CSSTransition } from 'react-transition-group';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import {
  handleAddDeck,
  handleDeleteDeck,
  handleEditDeck,
  handleAddCardToDeck,
  handleEditCard,
  handleDeleteCard,
} from '../../utils/handlers.js';

import './mainView-styles.css';

function MainView(props) {
  const {
    setView,
    isLoading,
    isDemoUser,
    fetchData,
    handleFlash,
    userContext,
    deckList,
    setDeckList,
    setStudyDeck,
  } = props;

  const [editingDeckIndex, setEditingDeckIndex] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const darkMode = useSelector((state) => state.darkMode);

  useEffect(() => {
    function handleKeyDown(e) {
      // press escape to go close dropdown
      if (e.keyCode === 27) {
        setDropdownIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <div className="heading-username">
        Hi, {userContext.details.firstName}!
      </div>
      {userContext.token ? (
        <div
          className="avatar-hover-container"
          onMouseLeave={() => setDropdownIsOpen(false)}
        >
          <div className="avatar-container-small">
            <Welcome
              className="Welcome"
              dropdownIsOpen={dropdownIsOpen}
              setDropdownIsOpen={setDropdownIsOpen}
            />
          </div>
        </div>
      ) : null}
      {/* <button className="hamburger-container" aria-label="Menu">
        <FontAwesomeIcon icon={faBars} />
      </button> */}
    </div>
  );

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
          tabIndex="0"
          aria-label={`Deck ${deck.name}`}
        />
      </li>
    );
  });

  const mainContainer = (
    <div className="main-container">
      <ul className="deck-list" aria-label="Deck List">
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
    <div className={`MainView${darkMode ? ' dark' : ''}`}>
      <CSSTransition
        in={dropdownIsOpen}
        classNames="dropdown-fade"
        timeout={300}
        unmountOnExit
      >
        <DropdownMenu
          setDropdownIsOpen={setDropdownIsOpen}
          isOpen={dropdownIsOpen}
          setView={setView}
        />
      </CSSTransition>
      <div className="header-main" role="banner">
        {heading}
      </div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <div className="loading">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div role="main">{mainContainer}</div>
      )}
      {!userContext.token && 'No User Token'}
      {/* <div id="darkmode">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onClick={handleToggleDarkMode}
        />
        <label htmlFor="checkbox" className="label">
          <FontAwesomeIcon icon={faMoon} />
          <FontAwesomeIcon icon={faSun} />
          <div className="ball"></div>
        </label>
      </div> */}
    </div>
  );
}

export default MainView;
