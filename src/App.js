import './App.css';
import React from 'react';

import FlashcardsContainer from './components/flashcards-container/flashcards-container.component';
import Data from './data';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Data;
  }
  render() {
    return (
      <div>
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

export default App;
