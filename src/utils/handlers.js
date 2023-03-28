import { v4 as uuidv4 } from 'uuid';

// ------------ DEMOMODE CRUD OPERATIONS ------------

export const handleAddDeck = (deckList, setDeckList, user, deckName) => {
  const newDeck = {
    _id: uuidv4(),
    name: deckName,
    user: user,
    cards: [],
  };
  setDeckList([...deckList, newDeck]);
};

export const handleDeleteDeck = (deckList, setDeckList, deckId) => {
  const updatedDecks = deckList.filter((deck) => deck._id !== deckId);
  setDeckList(updatedDecks);
};

export const handleEditDeck = (deckList, setDeckList, deckId, deckName) => {
  const deckIndex = deckList.findIndex((deck) => deck._id === deckId);
  const deck = deckList[deckIndex];
  deck.name = deckName;
  const updatedDecks = [
    ...deckList.slice(0, deckIndex),
    deck,
    ...deckList.slice(deckIndex + 1),
  ];
  setDeckList(updatedDecks);
};

export const handleAddCardToDeck = (deckList, setDeckList, data) => {
  const newCard = {
    _id: uuidv4(),
    ...data,
  };

  const updatedDecks = deckList.map((deck) => {
    if (data.deck === deck._id) {
      return {
        ...deck,
        cards: [...deck.cards, newCard],
      };
    } else {
      return deck;
    }
  });

  setDeckList(updatedDecks);
};

export const handleEditCard = (deckList, setDeckList, data) => {
  // 1. find deck and card from ID
  const deckIndex = deckList.findIndex((deck) => deck._id === data.deck);

  const cardIndex = deckList[deckIndex].cards.findIndex(
    (card) => card._id === data.cardId
  );

  const deck = deckList[deckIndex];
  const card = deck.cards[cardIndex];

  // 2. Update properties of card
  card.cardFront = data.cardFront;
  card.cardBack = data.cardBack;

  // 3. Update deck list with updated deck
  const updatedDecks = [...deckList];
  updatedDecks[deckIndex] = {
    ...deck,
    cards: [
      ...deck.cards.slice(0, cardIndex),
      card,
      ...deck.cards.slice(cardIndex + 1),
    ],
  };
  setDeckList(updatedDecks);
};

export const handleDeleteCard = (deckList, setDeckList, deckId, cardId) => {
  const deckIndex = deckList.findIndex((deck) => deck._id === deckId);
  const updatedDecks = [...deckList];
  updatedDecks[deckIndex].cards = deckList[deckIndex].cards.filter(
    (card) => card._id !== cardId
  );

  setDeckList(updatedDecks);
};
