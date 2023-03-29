import {
  React,
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { UserContext } from '../../context/UserContext';

import './myAccount-styles.css';

const MyAccount = (props) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studysessions, setStudysessions] = useState([]);

  const { toggleAccountPage, deckData, userDetails, handleFlash } = props;

  const modalRef = useRef(null);

  // load statistic data when component mounts
  const fetchStudysessionData = useCallback(async () => {
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
    fetchStudysessionData();
  }, [fetchStudysessionData]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        toggleAccountPage();
      }
    }

    function handleEscapePress(e) {
      if (e.key === 'Escape') {
        toggleAccountPage();
      }
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapePress);

    return () => {
      document.removeEventListener('click', handleClickOutside);
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

      handleFlash('success', 'Studysessions deleted!', 2000);
      // await fetchData();
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };

  return (
    // FIXME: implement closing modal on click anywhere except buttons
    <div className="modal">
      <div className="modal-main" ref={modalRef}>
        <button onClick={toggleAccountPage}>X</button>
        <h1>{userDetails.firstName}</h1>
        <span>
          (Hardly studying since {convertDateString(userDetails.createdAt)})
        </span>
        <h2>Statistics</h2>
        <p>Total Decks: {deckData.length}</p>
        <p>Total Cards: {calculateTotalCards(deckData)}</p>
        <p>Total Study Sessions: {studysessions.length} </p>
        {isNaN(calculateAverageTime(studysessions)) || (
          <>
            <p>✅: {calculateCorrectCardsPercentage(studysessions)}%</p>
            <p>Average ⏱: {calculateAverageTime(studysessions)}s</p>
          </>
        )}

        <button onClick={handleResetStatistics}>Reset Statistics</button>
        {/* <button>Change Password</button> */}
        <button onClick={handleDelete} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting Account...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
