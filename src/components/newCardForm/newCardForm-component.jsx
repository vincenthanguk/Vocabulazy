import React from 'react';

import './newCardForm-styles.css';

class NewCardForm extends React.Component {
  initialState = {
    cardFront: '',
    cardBack: '',
  };

  state = this.initialState;

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  submitForm = () => {
    this.props.handleSubmit(this.state);
    this.setState(this.initialState);
  };

  render() {
    const { cardFront, cardBack } = this.state;

    return (
      <form>
        <label htmlFor="cardFront">Front: </label>
        <input
          type="text"
          name="cardFront"
          id="cardFront"
          value={cardFront}
          onChange={this.handleChange}
        />
        <label htmlFor="cardBack">Back: </label>
        <input
          type="text"
          name="cardBack"
          id="cardBack"
          value={cardBack}
          onChange={this.handleChange}
        />
        <input type="button" value="Submit" onClick={this.submitForm} />
      </form>
    );
  }
}

export default NewCardForm;
