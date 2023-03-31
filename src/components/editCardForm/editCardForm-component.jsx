import React, { useState, useContext, useRef, useEffect } from 'react';
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
    isDemoUser,
    onAddCard,
    onEditCard,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const cardFrontInput = useRef(null);

  useEffect(() => {
    cardFrontInput.current.focus();
  }, []);

  const [formValue, setFormValue] = useState({
    cardFront: cardFront || '',
    cardBack: cardBack || '',
  });

  // set up two scenarios:
  // 1) without 'initialValue' -> edit the card (PATCH)
  // 2) with 'initialValue' of newCard -> add new card to deck

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        console.log('escape pressed');
        const button = document.querySelector(
          '.emoji-btn.form-cancel-edit-btn'
        );
        if (button) {
          button.click();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    if (initialValue === 'newCard') {
      // add new card to deck
      try {
        e.preventDefault();
        setSubmitInParent(true);
        if (isDemoUser) {
          // save card to state in demo mode
          onAddCard({
            cardFront: formValue.cardFront,
            cardBack: formValue.cardBack,
            deck: deckId,
            user: userContext._id,
          });
        } else {
          // post to api
          await fetch(process.env.REACT_APP_API_ENDPOINT + 'cards', {
            method: 'POST',
            credentials: 'include',
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
        }
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
        // no initial value, PATCH the card
        e.preventDefault();
        if (isDemoUser) {
          // edit card in state in demo mode
          onEditCard({
            cardFront: formValue.cardFront,
            cardBack: formValue.cardBack,
            deck: deckId,
            cardId: cardId,
            user: userContext._id,
          });
        } else {
          // API PATCH Request
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
        }
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
      <form className="form-edit" onSubmit={handleSubmit}>
        <div className="card-number">{cardNumber}</div>
        <label className="label label-front" htmlFor="cardFront">
          Front:{' '}
        </label>
        <input
          className="input input-front"
          type="text"
          name="cardFront"
          id="cardFront"
          value={formValue.cardFront}
          onChange={handleChange}
          ref={cardFrontInput}
          required
        />
        <label className="label label-back" htmlFor="cardBack">
          Back:{' '}
        </label>
        <input
          className="input input-back"
          type="text"
          name="cardBack"
          id="cardBack"
          value={formValue.cardBack}
          onChange={handleChange}
          required
        />
        <button
          className="emoji-btn form-submit-btn"
          type="submit"
          disabled={isSubmitting}
        >
          ✅
        </button>
        {/* don't show button on new cards */}

        <button
          className="emoji-btn form-cancel-edit-btn"
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
