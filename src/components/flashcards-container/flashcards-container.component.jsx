import React from 'react';
import './flashcards-container.styles.css';

import Flashcard from '../flashcard/flashcard.component';
import Form from '../form/form-component';

class FlashcardsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: [
        {
          cardFront: 'Front Test 1',
          cardBack: 'Back Test 1',
        },
        {
          cardFront: 'Front Test 2',
          cardBack: 'Back Test 2',
        },
      ],
    };
  }

  handleSubmit = (card) => {
    this.setState({ deck: [...this.state.deck, card] });
  };

  render() {
    return (
      <div className="container">
        <h1>Deck</h1>
        <ul>
          {this.state.deck.map(({ cardFront, cardBack }, index) => {
            return (
              <li key={index}>
                <Flashcard
                  cardId={index + 1}
                  front={cardFront}
                  back={cardBack}
                />
              </li>
            );
          })}
        </ul>
        <Form handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default FlashcardsContainer;
