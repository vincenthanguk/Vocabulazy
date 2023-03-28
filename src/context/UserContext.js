import React, { useState } from 'react';

const UserContext = React.createContext([{}, () => {}]);

const UserProvider = (props) => {
  const [state, setState] = useState({});
  const [demoMode, setDemoMode] = useState(true); // set initial demo mode

  // add mock user data
  const mockUser = {
    _id: 'u1',
    username: 'demoUser',
    decks: ['d1', 'd2', 'd3'],
    token: 'demoUser',
    details: {
      firstName: 'Demo User',
      createdAt: '2022-09-22T05:14:47.145+00:00',
    },
  };

  const toggleDemoMode = () => {
    console.log('inside toggleDemoMode!');
    console.log(state);
    console.log(demoMode);
    if (demoMode === true) {
      setDemoMode(false);
      setState({});
      console.log('demoMode set to false');
    } else {
      setDemoMode(true);
      setState(mockUser);
      console.log('demoMode set to true');
    }
  };

  // prevent that state is set to mockUser multiple times
  if (demoMode && Object.keys(state).length === 0) {
    setState(mockUser);
  }

  return (
    <UserContext.Provider value={[state, setState, toggleDemoMode]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
