import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './editCardForm-styles.css';

function EditCardForm(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValue, setFormValue] = useState({
    cardFront: '',
    cardBack: '',
  });

  useEffect(() => {
    console.log(props);
  }, []);

  const { cardId, fetchData, toggle, handleFlash } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const response = await axios.patch(
        `http://localhost:8000/api/v1/cards/${cardId}`,
        {
          cardFront: formValue.cardFront,
          cardBack: formValue.cardBack,
        }
      );
      console.log(response);
      setIsSubmitting(false);
      handleFlash('success', 'Card edited!', 2000);
      fetchData();
      toggle();
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}

export default EditCardForm;
