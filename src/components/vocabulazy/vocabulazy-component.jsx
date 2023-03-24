import React, { useCallback, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Deck from '../deck/deck-component';
// import deckData from '../../data/data';
import Login from '../login/login-component';
import Study from '../study/study-component';
import NewDeckForm from '../newDeckForm/newDeckForm-component';
import FlashMessage from '../flashMessage/flashMessage-component';
import Welcome from '../welcome/welcome-component';
import MyAccount from '../myAccount/myAccount-component';

import './vocabulazy-styles.css';

function Vocabulazy() {
  const [userContext, setUserContext] = useContext(UserContext);
  const [deck, setDeck] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [currentlyEditingIndexDeck, setCurrentlyEditingIndexDeck] = useState(
    null
  );
  const [studyDeck, setStudyDeck] = useState(0);
  const [isShowingFlash, setIsShowingFlash] = useState(false);
  const [isShowingAccountPage, setIsShowingAccountPage] = useState(false);
  const [flash, setFlash] = useState({ message: '', style: '' });

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + 'users/refreshToken', {
      method: 'POST',
      credentials: 'include',
      SameSite: 'none',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const logoutHandler = () => {
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
    handleFlash('success', 'You are now logged out', 2000);
  };

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
    setDeck(deckData.data.decks);
    setIsLoading(false);
  };

  // fetching data from API upon loading
  useEffect(() => {
    // console.log(userContext);
    let controller = new AbortController();
    setIsError(false);
    (async () => {
      try {
        // fetchData();
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
        setDeck(deckData.data.decks);
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

  // toggle study mode on/off, sets deck to be studied so it can be rendered in study view
  const toggleStudy = (deckNum) => {
    setIsStudying(() => !isStudying);
    setStudyDeck(deckNum);
    setIsAddingDeck(false);
  };

  const checkFlash = (status, message) => {
    const flash = {};
    flash.message = message;

    if (status === 'success') flash.style = 'flashMessage green';
    if (status === 'error') flash.style = 'flashMessage red';

    return flash;
  };

  // flash message
  const handleFlash = (status, message, flashTime) => {
    setIsShowingFlash(true);
    setFlash(checkFlash(status, message));
    setTimeout(() => {
      setIsShowingFlash(false);
    }, flashTime);
  };

  const toggleNewDeckForm = () => {
    setIsAddingDeck(!isAddingDeck);
  };

  const toggleAccountPage = () => {
    setIsShowingAccountPage(!isShowingAccountPage);
  };

  let studyView;
  // conditional rendering in case no decks are loaded from DB
  if (deck.length > 0) {
    studyView = (
      <Study
        deck={deck[studyDeck].cards}
        deckName={deck[studyDeck].name}
        deckId={deck[studyDeck]._id}
      />
    );
  }

  const noDecks = <div>Try adding your first deck!</div>;

  const deckContainers = deck.map((deck, i) => {
    return (
      <li className="liContainer" key={i}>
        <Deck
          deck={deck.cards}
          deckId={deck._id}
          deckNumber={i}
          deckName={deck.name}
          toggleStudy={toggleStudy}
          fetchData={fetchData}
          handleFlash={handleFlash}
        />
      </li>
    );
  });

  const heading = (
    <>
      <h1 className="heading-title">Vocabulazy 🤓</h1>
      <span className="span-title">Your Daily Study Helper</span>
      {!isStudying && userContext.token ? (
        <Welcome toggle={toggleAccountPage} />
      ) : null}
    </>
  );

  const newDeckButton = (
    <button onClick={() => setIsAddingDeck(!isAddingDeck)}>
      {isAddingDeck ? 'X' : 'Add Deck'}
    </button>
  );

  const newDeckContainer = (
    <li className="liContainer">
      <div className="container-deck">
        {isAddingDeck || newDeckButton}

        {isStudying ||
          (isAddingDeck && (
            <>
              <NewDeckForm
                fetchData={fetchData}
                handleFlash={handleFlash}
                toggle={toggleNewDeckForm}
              />
              {newDeckButton}
            </>
          ))}
      </div>
    </li>
  );

  const mainContainer = (
    <>
      <div className="mainContainer">
        {/* display deckcontainers when not in study mode */}
        {isStudying || (
          <ul className="deckUl">
            {deckContainers}
            {newDeckContainer}
          </ul>
        )}
        {/* display studyview when in study mode */}
        {isStudying && studyView}
        {deck.length > 0 || noDecks}
        {isStudying && (
          <button className="backbtn" onClick={() => toggleStudy(studyDeck)}>
            Back to Decks
          </button>
        )}
      </div>
      <div className="footer">
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </>
  );

  const loading = <div>Loading Decks...</div>;

  // return (
  //   <>
  //     {isShowingFlash && <FlashMessage flash={flash} />}
  //     <div className="Vocabulazy">
  //       {heading}
  //       {!userContext.token ? (
  //         <>{isLoading ? loading : mainContainer}</>
  //       ) : (
  //         <>
  //           <div className="mainContainer">
  //             <Login handleFlash={handleFlash} />
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </>
  // );
  return (
    <>
      {isShowingAccountPage && (
        <MyAccount
          toggle={toggleAccountPage}
          deckData={deck}
          userDetails={userContext.details}
          handleFlash={handleFlash}
        />
      )}
      {isShowingFlash && <FlashMessage flash={flash} />}
      <div className="Vocabulazy">
        <div className="header-main">{heading}</div>
        {isLoading ? loading : userContext.token && mainContainer}
        {userContext.token === null && (
          <>
            <div className="mainContainer">
              <Login handleFlash={handleFlash} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Vocabulazy;
