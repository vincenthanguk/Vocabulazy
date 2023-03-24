import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

import './editCardForm-styles.css';

function EditCardForm(props) {
  const {
    cardId,
    cardNumber,
    cardFront,
    cardBack,
    deckId,
    fetchData,
    handleFlash,
    setSubmitInParent,
    isSubmitting,
    initialValue,
    onEditClick,
  } = props;
  const [userContext, setUserContext] = useContext(UserContext);

  const [formValue, setFormValue] = useState({
    cardFront: cardFront || '',
    cardBack: cardBack || '',
  });

  // set up two scenarios:
  // 1) without 'initialValue' -> edit the card (PATCH)
  // 2) with 'initialValue' of newCard -> add new card to deck

  const handleSubmit = async (e) => {
    console.log('inside handle submit');
    if (initialValue === 'newCard') {
      try {
        e.preventDefault();
        setSubmitInParent(true);
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
            user: userContext.details._id,
          }),
        });

        await fetchData();
        handleFlash('success', 'Card created!', 2000);
        setSubmitInParent(false);
        setFormValue({
          cardFront: '',
          cardBack: '',
        });
        // toggleAddCardForm();
        onEditClick();
      } catch (err) {
        console.log(err);
        handleFlash('error', 'Oops, something went wrong!', 2000);
        setSubmitInParent(false);
      }
    } else {
      try {
        console.log('inside handle submit 2');
        e.preventDefault();
        setSubmitInParent(true);

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
        await fetchData();
        handleFlash('success', 'Card edited!', 2000);
        setSubmitInParent(false);
        onEditClick();
      } catch (err) {
        console.log(err);
        handleFlash('error', 'Oops, something went wrong!', 2000);
        setSubmitInParent(false);
      }
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
        <div className="cardNumber">{cardNumber}</div>
        <label className="label labelFront" htmlFor="cardFront">
          Front:{' '}
        </label>
        <input
          className="input inputFront"
          type="text"
          name="cardFront"
          id="cardFront"
          value={formValue.cardFront}
          onChange={handleChange}
          required
        />
        <label className="label labelBack" htmlFor="cardBack">
          Back:{' '}
        </label>
        <input
          className="input inputBack"
          type="text"
          name="cardBack"
          id="cardBack"
          value={formValue.cardBack}
          onChange={handleChange}
          required
        />
        <button
          className="emojiBtn formSubmitBtn"
          type="submit"
          disabled={isSubmitting}
        >
          ✅
        </button>
        {/* don't show button on new cards */}

        <button
          className="emojiBtn formCancelEditBtn"
          onClick={onEditClick}
          disabled={isSubmitting}
        >
          🚫
        </button>
      </form>
    </>
  );
}

export default EditCardForm;
