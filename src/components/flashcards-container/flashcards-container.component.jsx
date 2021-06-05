import React from 'react';
import './flashcards-container.styles.css';

import Flashcard from '../flashcard/flashcard.component';
import Form from '../form/form-component';

class FlashcardsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props };
  }

  handleSubmit = (card) => {
    this.setState({ deck: [...this.state.deck, card] });
  };

  removeCard = (index) => {
    const { deck } = this.state;

    this.setState({
      deck: deck.filter((card, i) => {
        return i !== index;
      }),
    });
  };

  render() {
    const { deckNumber, deckName, showCards, showForm } = this.props;
    const deck = this.state.deck;
    console.log(this.state);
    console.log(deck);

    const flashcards = deck.map((card, i) => {
      return (
        <li key={i}>
          <Flashcard cardId={i} front={card.cardFront} back={card.cardBack} />
        </li>
      );
    });

    const form = <Form handleSubmit={this.handleSubmit} />;

    return (
      <div className="container">
        <h1>
          Deck #{deckNumber + 1} Deck Name: "{deckName}" ({deck.length} Cards)
        </h1>
        <ul>{showCards && flashcards}</ul>
        {showForm && form}
      </div>
    );
  }
}

export default FlashcardsContainer;
