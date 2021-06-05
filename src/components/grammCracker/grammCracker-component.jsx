import React, { Component } from 'react';
import FlashcardsContainer from '../flashcards-container/flashcards-container.component';
import decks from '../../data/data';
import './grammCracker-styles.css';

class GrammCracker extends Component {
  constructor(props) {
    super(props);
    this.state = decks;
  }
  render() {
    return (
      <div className="GrammCracker">
        <h1>Gramm-Cracker</h1>
        <h2>Number of Decks: {Object.keys(this.state).length}</h2>
        <div className="mainContainer">
          <ul>
            {Object.entries(this.state).map(([key, value], index) => {
              return (
                <li key={index}>
                  <FlashcardsContainer
                    deck={(key, value)}
                    deckNumber={index + 1}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default GrammCracker;
