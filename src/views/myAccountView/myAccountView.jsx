import { React, useState, useContext, useCallback, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { PieChart } from 'react-minimal-pie-chart';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import './myAccountView-styles.css';

const MyAccount = (props) => {
  const {
    setView,
    deckList,
    handleFlash,
    isDemoUser,
    demoStudysessionList,
    setDemoStudysessionList,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studysessions, setStudysessions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    return () => {
      setIsLoaded(false);
    };
  }, []);

  /*
  // load statistic data when component mounts
  const fetchStudysessionData = useCallback(async () => {
    // TODO: Fetch data from state
    const result = await fetch(
      process.env.REACT_APP_API_ENDPOINT + 'studysession',
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      }
    );
    const studysessionData = await result.json();
    setStudysessions(studysessionData.data.studysessions);
  }, [userContext.token]);

  useEffect(() => {
    if (!isDemoUser) fetchStudysessionData();
  }, [fetchStudysessionData]);
*/
  useEffect(() => {
    function handleEscapePress(e) {
      if (e.key === 'Escape') {
        // setView('mainView');
      }
    }

    document.addEventListener('keydown', handleEscapePress);

    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, [setView]);

  const calculateTotalCards = (decks) => {
    let cardSum = 0;
    decks.forEach((deck) => {
      cardSum += deck.cards.length;
    });
    return cardSum;
  };

  const calculateCorrectCardsPercentage = (sessions) => {
    let cardSum = 0;
    let correctCardSum = 0;
    sessions.forEach((studysession) => {
      cardSum += studysession.totalCards;
      correctCardSum += studysession.correctCards;
    });
    // inaccurate rounding with toFixed. not relevant for this use case.
    return (correctCardSum / cardSum).toFixed(2) * 100;
  };

  const calculateWrongCards = (sessions) => {
    let cardSum = 0;
    let wrongCardSum = 0;
    sessions.forEach((studysession) => {
      cardSum += studysession.totalCards;
      wrongCardSum += studysession.wrongCards;
    });
    return wrongCardSum;
  };

  const calculateCorrectCards = (sessions) => {
    let cardSum = 0;
    let correctCardSum = 0;
    sessions.forEach((studysession) => {
      cardSum += studysession.totalCards;
      correctCardSum += studysession.correctCards;
    });
    return correctCardSum;
  };

  function countUniqueDecks(sessions) {
    const uniqueDecks = new Set();

    for (const session of sessions) {
      uniqueDecks.add(session.deck);
    }

    return uniqueDecks.size;
  }

  function countCardsFromLatestSession(sessions) {
    console.log(sessions);
    const latestSessions = {};

    for (const session of sessions) {
      const deck = session.deck;

      if (
        !latestSessions[deck] ||
        latestSessions[deck].timestamp < session.timestamp
      ) {
        latestSessions[deck] = session;
      }
      console.log(latestSessions);
    }

    const cardCounts = {};

    for (const deck in latestSessions) {
      const session = latestSessions[deck];
      cardCounts[deck] = {
        correctCards: session.correctCards,
        wrongCards: session.wrongCards,
      };
    }

    return cardCounts;
  }

  const latestSessionCards = countCardsFromLatestSession(demoStudysessionList);
  console.log(
    'Correct and wrong cards count from latest sessions:',
    latestSessionCards
  );

  function sumCorrectCards(cards) {
    let totalCorrectCards = 0;

    for (const deck in cards) {
      totalCorrectCards += cards[deck].correctCards;
    }

    return totalCorrectCards;
  }

  function sumWrongCards(cards) {
    let totalWrongCards = 0;

    for (const deck in cards) {
      totalWrongCards += cards[deck].wrongCards;
    }

    return totalWrongCards;
  }

  const totalCorrectCards = sumCorrectCards(latestSessionCards);
  const totalWrongCards = sumWrongCards(latestSessionCards);

  const calculateAverageTime = (sessions) => {
    let totalTime = 0;
    sessions.forEach((studysession) => {
      totalTime += studysession.totalTime;
    });
    return (totalTime / sessions.length).toFixed(2);
  };

  const convertDateString = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  /*
  const handleDelete = async (e) => {
    try {
      // FIXME: toggle to prevent crash
      toggleAccountPage();
      e.preventDefault();
      setIsSubmitting(true);

      await fetch(process.env.REACT_APP_API_ENDPOINT + `users/me`, {
        method: 'DELETE',
        credentials: 'include',
        // SameSite: 'none',
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
      // await fetchData();
      handleFlash(
        'success',
        'User deleted! Thank you for using Vocabulazy',
        2000
      );
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };
  */

  const handleResetStatistics = async (e) => {
    try {
      if (isDemoUser) {
        setDemoStudysessionList([]);
      } else {
        setView('mainView');
        e.preventDefault();
        setIsSubmitting(true);

        await fetch(process.env.REACT_APP_API_ENDPOINT + 'studysession/', {
          method: 'DELETE',
          credentials: 'include',
          // SameSite: 'none',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
        });
      }
      handleFlash('success', 'Studysessions deleted!', 2000);
      // await fetchData();
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };

  // dynamic input for demo mode
  const input = studysessions.length > 0 ? studysessions : demoStudysessionList;

  const dataDecks = [
    {
      title: 'decksStudied',
      value: countUniqueDecks(demoStudysessionList),
      color: '#25a244',
    },
    {
      title: 'totalDecks',
      value: deckList.length - countUniqueDecks(demoStudysessionList),
      color: '#7d7e965d',
    },
  ];

  const dataCards = [
    {
      title: 'correctCards',
      value: totalCorrectCards,
      color: '#25a244',
    },
    {
      title: 'wrongCards',
      value: totalWrongCards,
      color: '#dc2f02',
    },
    {
      title: 'totalCards',
      value:
        calculateTotalCards(deckList) - totalCorrectCards - totalWrongCards,
      color: '#7d7e965d',
    },
  ];

  const excludeZeroValueData = (data) => {
    const filteredData = data.filter((entry) => entry.value > 0);
    return filteredData;
  };

  const dataDecksZeroExcluded = excludeZeroValueData(dataDecks);
  const dataCardsZeroExcluded = excludeZeroValueData(dataCards);
  console.log(dataCardsZeroExcluded.length);

  return (
    <div className="account-view-container">
      <div className="account-view-header">
        <button
          className="return-btn"
          onClick={() => setView(() => 'mainView')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="profile-picture">
          <div className="camera-btn">
            <FontAwesomeIcon icon={faCamera} />
          </div>
          <div className="account-view avatar-container">
            <img
              src={process.env.PUBLIC_URL + '/images/avatar.png'}
              className="account-view avatar-img"
              alt="user-avatar"
              role="button"
            />
          </div>
        </div>
        <div className="user-name">{userContext.details.firstName}</div>
        <div className="user-since">
          Hardly studying since{' '}
          {convertDateString(userContext.details.createdAt)}
        </div>
      </div>
      <div className="data-flashcards-container">
        <div className="data-flashcard data-one">
          <CSSTransition
            in={isLoaded}
            classNames="fade-one"
            timeout={400}
            unmountOnExit
          >
            <div className="data-flashcard-content">
              <div className="data-flashcard-header">Decks studied</div>
              <div className="data-flashcard-chart">
                {demoStudysessionList.length > 0 ? (
                  <PieChart
                    data={dataDecksZeroExcluded}
                    radius={35}
                    lineWidth={20}
                    rounded={true}
                    paddingAngle={dataDecks[1].value === 0 ? 0 : 20}
                    animate={true}
                    animationDuration={500}
                    label={({ dataEntry }) => dataEntry.value}
                    labelStyle={(i) => ({
                      fill: dataDecksZeroExcluded[i].color,
                      fontSize: '1.2rem',
                    })}
                    labelPosition={60}
                  />
                ) : (
                  '0'
                )}
              </div>
              <div className="data-flashcard-footer"></div>
            </div>
          </CSSTransition>
        </div>
        <div className="data-flashcard data-two">
          <CSSTransition
            in={isLoaded}
            classNames="fade-two"
            timeout={1000}
            unmountOnExit
          >
            <div className="data-flashcard-content">
              <div className="data-flashcard-header">Cards studied</div>
              <div className="data-flashcard-chart">
                {demoStudysessionList.length > 0 ? (
                  <PieChart
                    data={dataCardsZeroExcluded}
                    radius={35}
                    lineWidth={20}
                    rounded={true}
                    paddingAngle={dataCardsZeroExcluded.length === 1 ? 0 : 20}
                    animate={true}
                    animationDuration={500}
                    label={({ dataEntry }) => dataEntry.value}
                    labelStyle={(i) => ({
                      fill: dataCardsZeroExcluded[i].color,
                      fontSize: '1.2rem',
                    })}
                    labelPosition={60}
                  />
                ) : (
                  '0'
                )}
              </div>
            </div>
          </CSSTransition>
        </div>
        <div className="data-flashcard data-three">
          <CSSTransition
            in={isLoaded}
            classNames="fade-three"
            timeout={1600}
            unmountOnExit
          >
            <div className="data-flashcard-content">
              <div className="data-flashcard-header">Completed Sessions</div>
              <div className="data-flashcard-chart">{input.length}</div>
            </div>
          </CSSTransition>
        </div>
        <div className="data-flashcard data-four">
          <CSSTransition
            in={isLoaded}
            classNames="fade-four"
            timeout={2200}
            unmountOnExit
          >
            <div className="data-flashcard-content">
              <div className="data-flashcard-header">Avg. Time</div>
              <div className="data-flashcard-chart">
                <div>
                  {isNaN(calculateAverageTime(input))
                    ? '-'
                    : calculateAverageTime(input) + 's'}
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </div>
      {/* </div>
      </div> */}
      <button className="button button-small" onClick={handleResetStatistics}>
        Reset
      </button>
      {/* <button onClick={handleDelete} disabled={isDemoUser || isSubmitting}>
        {isSubmitting ? 'Deleting Account...' : 'Delete Account'}
      </button> */}
    </div>
  );
};

export default MyAccount;
