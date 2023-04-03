import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import StudyFlashcard from '../../components/studyFlashcard/studyFlashcard-component';
import StudyFlashcardTwo from '../../components/studyFlashcard/studyFlashcardTwo-component';
import ProgressBar from '../../components/progressBar/progressBar-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faSync,
  faChevronLeft,
  faStopwatch,
  faLayerGroup,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

import './studyView-styles.css';

function Study(props) {
  const {
    setView,
    deck,
    deckName,
    deckId,
    isDemoUser,
    demoStudysessionList,
    setDemoStudysessionList,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [studyDeck, setStudyDeck] = useState(deck);
  const [currentCard, setCurrentCard] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(true);
  const [isFirstCard, setIsFirstCard] = useState(true);
  const [isFlippedOne, setIsFlippedOne] = useState(false);
  const [isFlippedTwo, setIsFlippedTwo] = useState(false);

  const [cardIsFinished, setCardIsFinished] = useState(false);

  useEffect(() => setCurrentCard(generateRandomCard()), [studyDeck]);

  useEffect(() => {
    let interval = null;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!timerIsActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, timerSeconds]);

  useEffect(() => {
    if (studyDeck.length === 0) {
      console.log(`Total Cards Studied: ${correct.length} + ${wrong.length}`);
      console.log(`Total Time Elapsed: ${timerSeconds}`);
      console.log('deactivating timer');
      setTimerIsActive(false);
      submitSession();
      return;
    } else {
      return;
    }
  }, [studyDeck]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 32) {
        console.log('Space pressed');
        const button = document.querySelector(
          '.button-show.button.button-small'
        );
        if (button) {
          button.click();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // everytime the studydeck is changed, a new random card is selected as currentCard
  const generateRandomCard = () => {
    const ranNum = Math.floor(Math.random() * studyDeck.length);
    const card = studyDeck[ranNum];
    return card;
  };

  const studysessionData = {
    totalCards: correct.length + wrong.length,
    correctCards: correct.length,
    wrongCards: wrong.length,
    totalTime: timerSeconds,
    user: isDemoUser ? 'demoUser' : userContext.details._id,
    deck: deckId,
  };

  const submitSession = async () => {
    if (isDemoUser) {
      setDemoStudysessionList((prevState) => [...prevState, studysessionData]);
    } else {
      await fetch(process.env.REACT_APP_API_ENDPOINT + 'studysession', {
        method: 'POST',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          studysessionData,
        }),
      });
    }
  };

  const cardCorrect = (card) => {
    setCorrect((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
  };

  const cardWrong = (card) => {
    setWrong((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
  };

  const removeCard = (card) => {
    setStudyDeck(studyDeck.filter((item) => item._id !== card._id));
  };

  const resetDecks = () => {
    setStudyDeck(deck);
    setCorrect([]);
    setWrong([]);
    hideCard();
    setTimerSeconds(0);
    setTimerIsActive(true);
  };

  const revealCard = () => {
    if (isFirstCard) {
      setIsFlippedOne(true);
    } else {
      setIsFlippedTwo(true);
    }
  };

  const hideCard = () => {
    if (isFirstCard) {
      setIsFirstCard(false);
      setIsFlippedOne(false);
    } else {
      setIsFirstCard(true);
      setIsFlippedTwo(false);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${paddedSeconds}`;
  }

  return (
    <div className="Study">
      <div className="study-header-container">
        <div className="study-header">{deckName}</div>
        <button
          className="study-view button deck-study-button"
          onClick={() => setView('mainView')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="study-timer">
          <div className="stopwatch">
            <FontAwesomeIcon icon={faStopwatch} />
          </div>
          <div className="timer">{formatTime(timerSeconds)}</div>
        </div>
      </div>
      <div className="overview">
        <div className="overview-element stack">
          <div className="overview-icon">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div className="overview-count">{studyDeck.length}</div>
        </div>
        <div className="overview-element correct">
          <div className="overview-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="overview-count">{correct.length}</div>
        </div>
        <div className="overview-element wrong">
          <div className="overview-icon">
            <FontAwesomeIcon icon={faBan} />
          </div>
          <div className="overview-count">{wrong.length}</div>
        </div>
        <div className="ProgressBar">
          <ProgressBar total={15} current={3} />
        </div>
      </div>
      {currentCard && timerIsActive ? (
        <div className="card">
          <div style={{ display: isFirstCard ? 'block' : 'none' }}>
            <CSSTransition
              in={isFirstCard}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <StudyFlashcard
                cardId={currentCard.cardId}
                front={currentCard.cardFront}
                back={currentCard.cardBack}
                isFlipped={isFlippedOne}
                isFinished={cardIsFinished}
                key="card1"
              />
            </CSSTransition>
          </div>
          <div style={{ display: !isFirstCard ? 'block' : 'none' }}>
            <CSSTransition
              in={!isFirstCard}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <StudyFlashcardTwo
                cardId={currentCard.cardId}
                front={currentCard.cardFront}
                back={currentCard.cardBack}
                isFlipped={isFlippedTwo}
                isFinished={cardIsFinished}
                key="card2"
              />
            </CSSTransition>
          </div>
        </div>
      ) : (
        <div>Finished deck in {timerSeconds} seconds!</div>
      )}

      <div className="study-buttons">
        {currentCard && (
          <button
            className="button-show button button-small"
            onClick={(e) => revealCard(e)}
          >
            Show!
          </button>
        )}
        <>
          <button onClick={() => cardCorrect(currentCard)}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button onClick={() => cardWrong(currentCard)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </>
        {!currentCard && (
          <button onClick={() => resetDecks()}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Study;
