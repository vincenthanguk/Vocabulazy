import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './editCardForm-styles.css';

function EditCardForm(props) {
  const [formValue, setFormValue] = useState({
    cardFront: '',
    cardBack: '',
  });

  useEffect(() => {
    console.log(props);
  }, []);

  const { cardId, fetchData, toggle } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/cards/${cardId}`,
        {
          cardFront: formValue.cardFront,
          cardBack: formValue.cardBack,
        }
      );

      console.log(response);
      fetchData();
      toggle();
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

export default EditCardForm;
