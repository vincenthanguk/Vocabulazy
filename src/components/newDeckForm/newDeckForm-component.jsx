import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

function NewDeckForm(props) {
  const { fetchData, onFlash, toggle, isDemoUser, onAddDeck } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deckName, setDeckName] = useState('');

  const deckNameInput = useRef(null);

  useEffect(() => {
    deckNameInput.current.focus();
  }, []);

  // save deck to state when 'isDemoUser', else post to API
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      if (isDemoUser) {
        const user = userContext._id;
        console.log('demoUser saving deck');
        console.log(userContext);
        onAddDeck(user, deckName);
      } else {
        // make post request
        await fetch(process.env.REACT_APP_API_ENDPOINT + 'decks', {
          method: 'POST',
          credentials: 'include',
          // SameSite: 'none',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({
            name: deckName,
            user: userContext.details._id,
          }),
        });
        await fetchData();
      }
      onFlash('success', 'Deck created!', 2000);
      setIsSubmitting(false);
      toggle();
    } catch (err) {
      console.log(err);
      onFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
      setDeckName('');
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
          // does not have a name
          defaultValue={deckName}
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

export default NewDeckForm;
