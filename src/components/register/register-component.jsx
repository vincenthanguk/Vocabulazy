import { React, useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

import './register-styles.css';

function Register(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  const { toggle, handleFlash } = props;

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const genericErrorMessage = 'Something went wrong! Please try again later.';

    fetch(process.env.REACT_APP_API_ENDPOINT + 'users/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, username: email, password }),
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
          } else if (response.status === 500) {
            // const data = await response.json();
            // if (data.message) setError(data.message || genericErrorMessage);
            // setError(data.message || genericErrorMessage);
            setError(genericErrorMessage);
            handleFlash('error', genericErrorMessage, 2000);
          } else {
            setError(genericErrorMessage);
            handleFlash('error', error, 2000);
          }
        } else {
          const data = await response.json();
          setUserContext((oldValues) => {
            return { ...oldValues, token: data.token };
          });
          handleFlash('success', 'Welcome to Gramm-Cracker!', 2000);
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
        handleFlash('error', error, 2000);
      });
  };

  return (
    <div className="Register">
      <h3>Register</h3>
      <form onSubmit={formSubmitHandler}>
        <div>
          <label htmlFor="firstName">First Name: </label>
          <input
            id="firstName"
            placeholder="First Name"
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name: </label>
          <input
            id="lastName"
            placeholder="Last Name"
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
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
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <button onClick={toggle}>Back to Login</button>
    </div>
  );
}

export default Register;
