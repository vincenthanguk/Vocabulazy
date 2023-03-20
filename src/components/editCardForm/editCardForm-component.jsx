import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './editCardForm-styles.css';

function EditCardForm(props) {
  const { cardId, cardFront, cardBack, fetchData, toggle, handleFlash } = props;
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValue, setFormValue] = useState({
    cardFront: cardFront || '',
    cardBack: cardBack || '',
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);

      await fetch(process.env.REACT_APP_API_ENDPOINT + `cards/${cardId}`, {
        method: 'PATCH',
        credentials: 'include',
        // SameSite: 'none',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          cardFront: formValue.cardFront,
          cardBack: formValue.cardBack,
        }),
      });

      // const response = await axios.patch(
      //   `http://localhost:8000/api/v1/cards/${cardId}`,
      //   {
      //     cardFront: formValue.cardFront,
      //     cardBack: formValue.cardBack,
      //   }
      // );
      // console.log(response);
      await fetchData();
      handleFlash('success', 'Card edited!', 2000);
      setIsSubmitting(false);
      toggle();
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
      <form className="editForm" onSubmit={handleSubmit}>
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
        <div type="submit" disabled={isSubmitting}>
          {isSubmitting ? '' : '✅'}
        </div>
      </form>
    </>
  );
}

export default EditCardForm;
