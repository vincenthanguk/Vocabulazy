import React, { useState } from 'react';
import FlashcardsContainer from '../flashcards-container/flashcards-container.component';
import deckData from '../../data/data';
import './grammCracker-styles.css';

function GrammCracker() {
  // deck data comes from data.js
  // FIXME: change data format to sth. more JSON like
  // this.state = { data: deckData };
  const [deck, setDeck] = useState(deckData);

  // const deckContainers = Object.entries(this.state.decks).map(
  //   ([key, value], index) => {
  //     return (
  //       <li key={index}>
  //         <FlashcardsContainer deck={(key, value)} deckNumber={index + 1} />
  //       </li>
  //     );
  //   }
  // );

  const deckContainers = deck.map((deck, i) => {
    return (
      <li key={i}>
        <FlashcardsContainer
          deck={deck.cards}
          deckNumber={i}
          deckName={deck.name}
          showCards={deck.showCards}
        />
      </li>
    );
  });

  return (
    <div className="GrammCracker">
      <h1>Gramm-Cracker</h1>
      <h2>Number of Decks: {deck.length}</h2>
      <div className="mainContainer">
        <ul>{deckContainers}</ul>
      </div>
    </div>
  );
}

export default GrammCracker;
