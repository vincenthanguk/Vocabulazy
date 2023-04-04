import { React, useState, useContext, useCallback, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { PieChart } from 'react-minimal-pie-chart';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import './myAccountView-styles.css';

const MyAccount = (props) => {
  const {
    toggleAccountPage,
    deckData,
    handleFlash,
    isDemoUser,
    demoStudysessionList,
    setDemoStudysessionList,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studysessions, setStudysessions] = useState([]);

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
        toggleAccountPage();
      }
    }

    document.addEventListener('keydown', handleEscapePress);

    return () => {
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, [toggleAccountPage]);

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
    console.log('cardSum: ', cardSum);
    console.log('correctCardSum: ', correctCardSum);
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
    console.log('cardSum: ', cardSum);
    console.log('wrongCardSum: ', wrongCardSum);
    return wrongCardSum;
  };

  const calculateAverageTime = (sessions) => {
    let totalTime = 0;
    sessions.forEach((studysession) => {
      totalTime += studysession.totalTime;
    });
    console.log('total time: ', totalTime);
    console.log('# of sessions: ', sessions.length);
    return (totalTime / sessions.length).toFixed(2);
  };

  const convertDateString = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

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

  const handleResetStatistics = async (e) => {
    try {
      if (isDemoUser) {
        setDemoStudysessionList([]);
      } else {
        toggleAccountPage();
        e.preventDefault();
        console.log('resetting stats');
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

  const dataMock = [
    { title: 'One', value: 10, color: '#E38627' },
    { title: 'Two', value: 15, color: '#C13C37' },
    { title: 'Three', value: 20, color: '#6A2135' },
  ];

  return (
    <div className="account-view-container">
      {/* <button onClick={toggleAccountPage}>X</button> */}
      <div className="account-view-header">
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
      <div className="user-stats">
        <div className="top-stats top-stats-decks">Decks</div>
        <div className="bottom-stats bottom-stats-decks">{deckData.length}</div>
        <div className="top-stats top-stats-cards">Cards</div>
        <div className="bottom-stats bottom-stats-cards">
          {calculateTotalCards(deckData)}
        </div>
        <div className="top-stats top-stats-sessions">Sessions</div>
        <div className="bottom-stats bottom-stats-sessions">{input.length}</div>
        <div className="top-stats top-stats-time">Avg. Time</div>
        <div className="bottom-stats bottom-stats-time">
          {isNaN(calculateAverageTime(input)) || calculateAverageTime(input)}s
        </div>
      </div>
      <div className="user-chart">
        <PieChart
          data={dataMock}
          radius={30}
          lineWidth={20}
          rounded={true}
          label={({ dataEntry }) => dataEntry.value}
          labelStyle={(i) => ({
            fill: dataMock[i].color,
            fontSize: '1rem',
          })}
          labelPosition={60}
        />
      </div>
      <button className="button button-small">Back</button>
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
