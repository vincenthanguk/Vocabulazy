import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

import Deck from '../deck/deck-component';
import Login from '../login/login-component';
import Study from '../study/study-component';
import NewDeckForm from '../newDeckForm/newDeckForm-component';
import FlashMessage from '../flashMessage/flashMessage-component';
import Welcome from '../welcome/welcome-component';
import MyAccount from '../myAccount/myAccount-component';

import mockData from '../../data/mockData.json';

import {
  handleAddDeck,
  handleDeleteDeck,
  handleEditDeck,
  handleAddCardToDeck,
  handleEditCard,
  handleDeleteCard,
} from '../../utils/handlers.js';

import { useVerifyUser } from '../../utils/auth';

import './vocabulazy-styles.css';

function Vocabulazy() {
  const [userContext, setUserContext, toggleDemoMode] = useContext(UserContext);
  const [deckList, setDeckList] = useState([]);
  const [demoStudysessionList, setDemoStudysessionList] = useState([
    {
      id: 'asd',
      totalCards: 15,
      correctCards: 15,
      wrongCards: 0,
      totalTime: 6,
      user: 'u1',
      deck: 'd1',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [studyDeck, setStudyDeck] = useState(0);
  const [isShowingFlash, setIsShowingFlash] = useState(false);
  const [isShowingAccountPage, setIsShowingAccountPage] = useState(false);
  const [flash, setFlash] = useState({ message: '', style: '' });

  // -------------- USER VERIFICATION + DATA FETCHING --------------

  const verifyUser = useVerifyUser(userContext, setUserContext);

  useEffect(() => {
    if (userContext.username !== 'demoUser') {
      verifyUser();
    }
  }, [verifyUser, userContext.username]);

  // fetch deck data from API
  const fetchData = async () => {
    console.log('fetching data...');
    const result = await fetch(
      process.env.REACT_APP_API_ENDPOINT + `decks/${userContext.details._id}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      }
    );

    const deckData = await result.json();
    setDeckList(deckData.data.decks);
    setIsLoading(false);
  };

  // fetch mock data from JSON
  const fetchMockData = async (type) => {
    if (type in mockData) {
      return new Response(JSON.stringify(mockData[type]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Not found', {
        status: 404,
        headers: { 'Content-Type': 'application.json' },
      });
    }
  };

  // fetch data from API upon loading
  useEffect(() => {
    let controller = new AbortController();
    setIsError(false);
    (async () => {
      try {
        // LOAD MOCK USER DATA
        if (userContext.username === 'demoUser') {
          setIsDemoUser(true);
          const result = await fetchMockData('decks');
          const deckData = await result.json();
          setDeckList(deckData);
        } else {
          console.log('fetching api data');
          const result = await fetch(
            process.env.REACT_APP_API_ENDPOINT +
              `decks/${userContext.details._id}`,
            {
              signal: controller.signal,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userContext.token}`,
              },
            }
          );
          const deckData = await result.json();
          setDeckList(deckData.data.decks);
        }
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        console.error('Looks like something went wrong! 💥', err);
        // set loading to false if no user is fetched (prevent loading... prompt)
        setIsLoading(false);
      }
    })();
    return () => controller?.abort();
  }, [userContext]);

  // --------------------- HANDLER FUNCTIONS ---------------------

  // logout handler
  const logoutHandler = () => {
    if (userContext.username === 'demoUser') {
      toggleDemoMode();
      // setIsDemoUser(false);
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });
    } else {
      fetch(process.env.REACT_APP_API_ENDPOINT + 'users/logout', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      }).then(async (response) => {
        setUserContext((oldValues) => {
          return { ...oldValues, details: undefined, token: null };
        });
        window.localStorage.setItem('logout', Date.now());
      });
    }
    handleFlash('success', 'You are now logged out', 2000);
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

  // --------------------- FLASH MESSAGES ---------------------

  // check flash message status and content
  const checkFlash = (status, message) => {
    const flash = {};
    flash.message = message;

    if (status === 'success') flash.style = 'flashMessage green';
    if (status === 'error') flash.style = 'flashMessage red';

    return flash;
  };

  const handleFlash = (status, message, flashTime) => {
    setIsShowingFlash(true);
    setFlash(checkFlash(status, message));
    setTimeout(() => {
      setIsShowingFlash(false);
    }, flashTime);
  };

  // --------------------- TOGGLES ---------------------

  // toggle study mode on/off, sets deck to be studied so it can be rendered in study view
  const toggleStudy = (deckNum) => {
    setIsStudying(() => !isStudying);
    setStudyDeck(deckNum);
    setIsAddingDeck(false);
  };

  const toggleNewDeckForm = () => {
    setIsAddingDeck(!isAddingDeck);
  };

  const handleToggleAccountPage = () => {
    setIsShowingAccountPage(!isShowingAccountPage);
  };

  // --------------------- ELEMENTS ---------------------

  let studyView;
  // conditional rendering in case no decks are loaded from DB
  if (deckList.length > 0) {
    studyView = (
      <Study
        deck={deckList[studyDeck].cards}
        deckName={deckList[studyDeck].name}
        deckId={deckList[studyDeck]._id}
        isDemoUser={isDemoUser}
        demoStudysessionList={demoStudysessionList}
        setDemoStudysessionList={setDemoStudysessionList}
      />
    );
  }

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
        />
      </li>
    );
  });

  const heading = (
    <div className="heading-container">
      <div className="heading-subheading">Let's be Vocabulazy today</div>
      <div className="heading-username">Hi {userContext.username}!</div>
      {!isStudying && userContext.token ? (
        <div className="avatar-container">
          <Welcome className="Welcome" toggle={handleToggleAccountPage} />
        </div>
      ) : null}
      <div className="darkmode-container">☽</div>
    </div>
  );

  // render main container
  const mainContainer = (
    <>
      <div className="main-container">
        {/* display deckcontainers when not in study mode */}
        {isStudying || (
          <ul className="deck-list">
            {deckContainers}
            <NewDeckForm
              fetchData={fetchData}
              onFlash={handleFlash}
              toggle={toggleNewDeckForm}
              isDemoUser={isDemoUser}
              isAddingDeck={isAddingDeck}
              isStudying={isStudying}
              onAddDeck={handleAddDeckWrapper}
            />
          </ul>
        )}
        {/* display studyview when in study mode */}
        {isStudying && studyView}
        {deckList.length > 0 || noDecks}
        {isStudying && (
          <button className="back-btn" onClick={() => toggleStudy(studyDeck)}>
            Back to Decks
          </button>
        )}
      </div>
      <div className="footer">
        {/* <button className="button" onClick={logoutHandler}>
          Log Out
        </button> */}
      </div>
    </>
  );

  const loading = <div>Loading Decks...</div>;

  return (
    <>
      {isShowingAccountPage && (
        <MyAccount
          toggleAccountPage={handleToggleAccountPage}
          deckData={deckList}
          userDetails={userContext.details}
          handleFlash={handleFlash}
          isDemoUser={isDemoUser}
          demoStudysessionList={demoStudysessionList}
          setDemoStudysessionList={setDemoStudysessionList}
        />
      )}
      {isShowingFlash && <FlashMessage flash={flash} />}
      <div className="Vocabulazy">
        <div className="header-main">{heading}</div>
        {isLoading ? loading : userContext.token && mainContainer}
        {userContext.token === null && (
          <>
            <div className="main-container">
              <Login handleFlash={handleFlash} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Vocabulazy;
