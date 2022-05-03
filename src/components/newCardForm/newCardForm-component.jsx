import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './newCardForm-styles.css';

function NewCardForm(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValue, setFormValue] = useState({
    cardFront: '',
    cardBack: '',
  });

  const { deckId, fetchData, handleFlash } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      await fetch(process.env.REACT_APP_API_ENDPOINT + 'cards', {
        method: 'POST',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          cardFront: formValue.cardFront,
          cardBack: formValue.cardBack,
          deck: deckId,
        }),
      });

      // const response = await axios.post('http://localhost:8000/api/v1/cards', {
      //   cardFront: formValue.cardFront,
      //   cardBack: formValue.cardBack,
      //   deck: deckId,
      // });

      await fetchData();
      handleFlash('success', 'Card created!', 2000);
      setIsSubmitting(false);
      setFormValue({
        cardFront: '',
        cardBack: '',
      });
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
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

export default NewCardForm;
