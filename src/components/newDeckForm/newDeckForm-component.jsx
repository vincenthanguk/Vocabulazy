import axios from 'axios';
import React, { useState } from 'react';

function NewDeckForm() {
  const [deckName, setDeckName] = useState('');

  const handleSubmit = async () => {
    // const deckFormData = new FormData();
    // deckFormData.append('name', deckName);
    // console.log(deckFormData);

    try {
      // make axios post request
      const response = await axios.post('http://localhost:8000/api/v1/decks', {
        name: deckName,
      });
      // ({
      //   method: 'post',
      //   url: 'http://localhost:8000/api/v1/decks',
      //   data: deckFormData,
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Deck Name:</label>
        <input
          type="text"
          name="deckName"
          required
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default NewDeckForm;
