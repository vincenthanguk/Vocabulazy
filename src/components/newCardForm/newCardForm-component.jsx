import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './newCardForm-styles.css';

function NewCardForm(props) {
  const [formValue, setFormValue] = useState({
    cardFront: '',
    cardBack: '',
  });

  useEffect(() => {
    console.log(props);
  }, []);

  const { deckId, fetchData, handleFlash } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/v1/cards', {
        cardFront: formValue.cardFront,
        cardBack: formValue.cardBack,
        deck: deckId,
      });
      console.log(response);
      handleFlash('success', 'Card created!', 2000);
      fetchData();
      setFormValue({
        cardFront: '',
        cardBack: '',
      });
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
    }
  };

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cardFront">Front: </label>
        <input
          type="text"
          name="cardFront"
          id="cardFront"
          value={formValue.cardFront}
          onChange={handleChange}
          required
        />
        <label htmlFor="cardBack">Back: </label>
        <input
          type="text"
          name="cardBack"
          id="cardBack"
          value={formValue.cardBack}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default NewCardForm;
