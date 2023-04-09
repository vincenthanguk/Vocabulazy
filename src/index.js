import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './context/UserContext';
import { Provider } from 'react-redux';
import store from './store/store';

import './index.css';

import Vocabulazy from './app/vocabulazy.jsx';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
