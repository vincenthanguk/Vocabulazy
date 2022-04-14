import { React, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

import Register from '../register/register';

function Login(props) {
  const { handleFlash } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const genericErrorMessage = 'Something went wrong! Please try again later.';

    fetch(process.env.REACT_APP_API_ENDPOINT + 'users/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError('Please fill all the fields correctly!');
            handleFlash('error', 'Please fill all the fields correctly!', 2000);
          } else if (response.status === 401) {
            setError('Invalid email and password combination.');
            handleFlash(
              'error',
              'Invalid email and password combination.',
              2000
            );
          } else {
            setError(genericErrorMessage);
            handleFlash('error', genericErrorMessage, 2000);
          }
        } else {
          const data = await response.json();
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
          handleFlash('success', 'Welcome!', 2000);
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
      });
  };

  // const fetchData = async () => {
  //   console.log('fetching data...');
  //   const result = await axios('http://localhost:8000/api/v1/decks');
  //   setDeck(result.data.data.decks);
  //   setIsLoading(false);
  // };

  const toggleIsRegistering = (e) => {
    e.preventDefault();
    setIsRegistering(() => !isRegistering);
  };

  return !isRegistering ? (
    <>
      <div>Login</div>
      <form onSubmit={formSubmitHandler}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <span>
        New to Gramm-Cracker? Please{' '}
        <button onClick={toggleIsRegistering}>register</button>!
      </span>
    </>
  ) : (
    <Register toggle={toggleIsRegistering} />
  );
}

export default Login;
