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

  const { deckId } = props;

  const handleSubmit = async () => {
    // e.preventDefault();
    //     {
    //     "cardFront": "test 4",
    //     "cardBack": "test 4 back",
    //     "deck": "62296cdb2514c612549e8846"
    // }
    // store states in form data
    // API takes raw JSON, not form data
    // const cardFormData = new FormData();
    // cardFormData.append('cardFront', formValue.cardFront);
    // cardFormData.append('cardBack', formValue.cardBack);
    // cardFormData.append('deck', deckId);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/cards', {
        cardFront: formValue.cardFront,
        cardBack: formValue.cardBack,
        deck: deckId,
      });
      // const response = await axios({
      //   method: 'post',
      //   url: 'http://localhost:8000/api/v1/cards',
      //   data: cardFormData,
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      console.log(response);
    } catch (err) {
      console.log(err);
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
        />
        <label htmlFor="cardBack">Back: </label>
        <input
          type="text"
          name="cardBack"
          id="cardBack"
          value={formValue.cardBack}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default NewCardForm;
