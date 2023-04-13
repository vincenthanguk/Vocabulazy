import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

import './editDeckForm-styles.css';

function EditDeckForm(props) {
  const {
    fetchData,
    onFlash,
    toggle,
    isDemoUser,
    isAddingDeck,
    onAddDeck,
    deckId,
    deckNumber,
    onEditDeck,
    initialValue,
    prevDeckName,
  } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deckName, setDeckName] = useState(prevDeckName || '');

  const deckNameInput = useRef(null);

  useEffect(() => {
    deckNameInput.current?.focus();
  }, [isAddingDeck]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        const button = document.querySelector(
          '.button.button-small.new-deck-btn.show-card-btn'
        );
        if (button) {
          button.click();
        }
      }
    }

    if (isAddingDeck) document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddingDeck]);

  // 1) with 'initialValue' of newDeck -> add new deck to state
  // 2) without 'initialValue' -> edit the deck (PATCH)

  // save deck to state when 'isDemoUser', else post to API
  const handleSubmit = async (e) => {
    if (initialValue === 'newDeck') {
      // 1) add deck
      try {
        // save deck to state
        e.preventDefault();
        setIsSubmitting(true);
        if (isDemoUser) {
          const user = userContext._id;
          onAddDeck(user, deckName);
          setDeckName('');
        } else {
          // make post request
          await fetch(process.env.REACT_APP_API_ENDPOINT + 'decks', {
            method: 'POST',
            credentials: 'include',
            // SameSite: 'none',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({
              name: deckName,
              user: userContext.details._id,
            }),
          });
          await fetchData();
        }
        onFlash('success', 'Deck created!', 2000);
        setIsSubmitting(false);
        toggle();
      } catch (err) {
        console.log(err);
        onFlash('error', 'Oops, something went wrong!', 2000);
        setIsSubmitting(false);
        setDeckName('');
      }
    } else {
      // 2) edit deck
      try {
        e.preventDefault();
        setIsSubmitting(true);
        // edit deck in local state in demo mode
        if (isDemoUser) {
          onEditDeck(deckId, deckName);
        } else {
          // make  APIpost request
          await fetch(process.env.REACT_APP_API_ENDPOINT + `decks/${deckId}`, {
            method: 'PATCH',
            credentials: 'include',
            // SameSite: 'none',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify({
              name: deckName,
            }),
          });
          await fetchData();
        }
        onFlash('success', 'Deck edited!', 2000);
        setIsSubmitting(false);
        toggle();
      } catch (err) {
        console.log(err);
        onFlash('error', 'Oops, something went wrong!', 2000);
        setIsSubmitting(false);
      }
    }
  };

  const newDeckButton = (
    <button
      className="button button-small new-deck-btn show-card-btn"
      onClick={() => toggle(deckNumber || 'addNewDeck')}
    >
      {isAddingDeck ? 'X' : 'Add Deck'}
    </button>
  );

  return (
    <div>
      {isAddingDeck || newDeckButton}
      {isAddingDeck && (
        <div className="deck-container">
          <div>
            <form className="deck-header form-new-deck" onSubmit={handleSubmit}>
              <div className="deck-name-container">
                <input
                  className="input-deck-name"
                  type="text"
                  name="deckName"
                  id="deckName"
                  maxLength={12}
                  defaultValue={initialValue === 'newDeck' ? '' : deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  ref={deckNameInput}
                  required
                />
              </div>
              <button
                className="button deck-study-button"
                type="submit"
                disabled={isSubmitting}
              >
                {initialValue === 'newDeck' ? 'Add' : 'Edit'}
              </button>
            </form>
          </div>
          <div>{newDeckButton}</div>
        </div>
      )}
    </div>
  );
}

export default EditDeckForm;
