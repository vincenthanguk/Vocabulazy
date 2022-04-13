import { React, useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`${email}, ${password}`);
  };

  return (
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
        New to Gramm-Cracker? Please <strong>register</strong>!
      </span>
    </>
  );
}

export default Login;
