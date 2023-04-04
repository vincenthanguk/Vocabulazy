import { React, useState, useContext, useCallback, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

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
        <h1>{userContext.details.firstName}</h1>
        <span>
          (Hardly studying since{' '}
          {convertDateString(userContext.details.createdAt)})
        </span>
      </div>
      <h2>Statistics</h2>
      <p>Total Decks: {deckData.length}</p>
      <p>Total Cards: {calculateTotalCards(deckData)}</p>
      <p>Total Study Sessions: {input.length} </p>
      {isNaN(calculateAverageTime(input)) || (
        <>
          <p>✅: {calculateCorrectCardsPercentage(input)}%</p>
          <p>Average ⏱: {calculateAverageTime(input)}s</p>
        </>
      )}

      <button onClick={handleResetStatistics}>Reset Statistics</button>
      {/* <button>Change Password</button> */}
      <button onClick={handleDelete} disabled={isDemoUser || isSubmitting}>
        {isSubmitting ? 'Deleting Account...' : 'Delete Account'}
      </button>
    </div>
  );
};

export default MyAccount;
