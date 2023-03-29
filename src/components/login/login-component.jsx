import { React, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

import './login-styles.css';
import Register from '../register/register-component';

function Login(props) {
  const { handleFlash } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [userContext, setUserContext, toggleDemoMode] = useContext(UserContext);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // TODO: insert demo mode
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
            handleFlash('error', error, 2000);
          } else if (response.status === 401) {
            setError('Invalid email and password combination.');
            handleFlash('error', error, 2000);
          } else {
            setError(genericErrorMessage);
            handleFlash('error', genericErrorMessage, 2000);
          }
        } else {
          const data = await response.json();
          console.log(data);
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
          handleFlash('success', 'Welcome to Vocabulazy!', 2000);
          console.log(userContext);
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
      });
  };

  const toggleIsRegistering = (e) => {
    e.preventDefault();
    setIsRegistering(() => !isRegistering);
  };

  const handleDemoClick = () => {
    toggleDemoMode();
  };

  return !isRegistering ? (
    <div className="Login">
      <h3>Login</h3>
      <form onSubmit={formSubmitHandler}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loggin in...' : 'Login'}
        </button>
      </form>
      <span>
        New to Gramm-Cracker? Please{' '}
        <button onClick={toggleIsRegistering}>register</button>!
      </span>
      <button onClick={handleDemoClick}>Click here for demo version!</button>
    </div>
  ) : (
    <Register toggle={toggleIsRegistering} handleFlash={handleFlash} />
  );
}

export default Login;
