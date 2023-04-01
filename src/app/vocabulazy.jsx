import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

import StudyView from '../views/studyView/studyView';
import FlashMessage from '../components/flashMessage/flashMessage-component';
import LoginView from '../views/loginView/loginView';
import MainView from '../views/mainView/mainView';

import mockData from '../data/mockData.json';

import { useVerifyUser } from '../utils/auth';

import './vocabulazy-styles.css';

function Vocabulazy() {
  const [userContext, setUserContext, toggleDemoMode] = useContext(UserContext);
  const [view, setView] = useState('mainView');
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
  const [editingDeckIndex, setEditingDeckIndex] = useState(null);
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
  };

  const handleToggleAccountPage = () => {
    setIsShowingAccountPage(!isShowingAccountPage);
  };

  let activeView;

  switch (view) {
    case 'loginView':
      activeView = <LoginView />;
      break;
    case 'mainView':
      activeView = (
        <MainView
          isStudying={isStudying}
          isLoading={isLoading}
          isDemoUser={isDemoUser}
          onToggleAccountPage={handleToggleAccountPage}
          userContext={userContext}
          deckList={deckList}
          setDeckList={setDeckList}
          toggleStudy={toggleStudy}
          fetchData={fetchData}
          handleFlash={handleFlash}
        />
      );
      break;
    case 'studyView':
      activeView = (
        <StudyView
          deck={deckList[studyDeck].cards}
          deckName={deckList[studyDeck].name}
          deckId={deckList[studyDeck]._id}
          isDemoUser={isDemoUser}
          demoStudysessionList={demoStudysessionList}
          setDemoStudysessionList={setDemoStudysessionList}
        />
      );
      break;

    default:
      activeView = <LoginView />;
      break;
  }

  return <div className="Vocabulazy">{activeView}</div>;
}

export default Vocabulazy;
