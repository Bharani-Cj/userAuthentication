import { useState } from 'react';

export default function LogIn() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const responce = await fetch(
      'https://user-authentication-8w3s.onrender.com/api/v1/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      }
    );
    const responceData = await responce.json();

    if (responceData.token) {
      localStorage.setItem('token', responceData.token);
      window.location.href = '/home';
    } else {
      setData(responceData);
    }
  }

  return (
    <div className="wrapper">
      <form className="formContainer" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => {
              setData('');
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => {
              setData('');
              setPassword(e.target.value);
            }}
          />
        </div>
        {data.message ? <p className="painted">{data.message}</p> : null}
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="22">Forgot password?</a>
        </div>
        <button type="submit" className="btn">
          login
        </button>

        <div className="register-link">
          <p>
            Don't have an account?
            <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}
