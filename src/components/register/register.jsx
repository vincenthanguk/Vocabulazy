import { React, useState } from 'react';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { toggle } = props;

  const formSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`${email}, ${password}`);
  };

  return (
    <>
      <div>Register</div>
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
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={toggle}>Back to Login</button>
    </>
  );
}

export default Register;
