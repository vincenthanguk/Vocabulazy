import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

function EditDeckForm(props) {
  const {
    fetchData,
    deckId,
    toggle,
    handleFlash,
    isDemoUser,
    onEditDeck,
    prevDeckName,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // initialize state with prevDeckName for the case when deck name is not changed (would otherwise return '')
  const [deckName, setDeckName] = useState(prevDeckName);

  const deckNameInput = useRef(null);

  useEffect(() => {
    deckNameInput.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      // edit deck in local state in demo mode
      if (isDemoUser) {
        onEditDeck(deckId, deckName);
      } else {
        // make  APIpost request
        await fetch(process.env.REACT_APP_API_ENDPOINT + `decks/${deckId}`, {
          method: 'PATCH',
          credentials: 'include',
          // SameSite: 'none',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            name: deckName,
          }),
        });
        await fetchData();
      }
      handleFlash('success', 'Deck edited!', 2000);
      setIsSubmitting(false);
      toggle();
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="deckName">Deck Name:</label>
        <input
          type="text"
          name="deckName"
          id="deckName"
          required
          defaultValue={prevDeckName}
          onChange={(e) => setDeckName(e.target.value)}
          ref={deckNameInput}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}

export default EditDeckForm;
