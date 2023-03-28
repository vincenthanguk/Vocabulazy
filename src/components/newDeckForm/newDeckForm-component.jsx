import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function NewDeckForm(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deckName, setDeckName] = useState('');
  const { fetchData, handleFlash, toggle } = props;

  // TODO: save deck to localStorage when 'isDemoUser'
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      // make axios post request
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
      // const deckData = await result.json();
      // setDeck(deckData.data.decks);
      // setIsLoading(false);

      // const response = await axios.post('http://localhost:8000/api/v1/decks', {
      //   name: deckName,
      //   user: userContext.details._id,
      // });
      // change of state most come before toggle (toggle unmounts the component)
      await fetchData();
      handleFlash('success', 'Deck created!', 2000);
      setIsSubmitting(false);
      toggle();
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
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
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        ></input>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}

export default NewDeckForm;
