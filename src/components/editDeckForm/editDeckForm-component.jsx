import React, { useState } from 'react';
import axios from 'axios';

function EditDeckForm(props) {
  const [deckName, setDeckName] = useState('');

  const { fetchData, deckId, toggle, handleFlash } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // make axios post request
      const response = await axios.patch(
        `http://localhost:8000/api/v1/decks/${deckId}`,
        {
          name: deckName,
        }
      );
      console.log(response);
      handleFlash('success', 'Deck edited!', 2000);
      fetchData();
      toggle();
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
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
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default EditDeckForm;
