import React, { useState } from 'react';
import axios from 'axios';

function EditDeckForm(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deckName, setDeckName] = useState('');

  const { fetchData, deckId, toggle, handleFlash } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      // make axios post request
      const response = await axios.patch(
        `http://localhost:8000/api/v1/decks/${deckId}`,
        {
          name: deckName,
        }
      );
      console.log(response);
      await fetchData();
      toggle();
      handleFlash('success', 'Deck edited!', 2000);
      setIsSubmitting(false);
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

export default EditDeckForm;
