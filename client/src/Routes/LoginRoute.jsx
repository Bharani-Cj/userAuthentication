import { useState } from 'react';

export default function LogIn() {
  return (
    <div className="wrapper">
      <Form></Form>
    </div>
  );
}

function Form() {
  const [data, setData] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
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
      setLoading(false);
    }
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
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
        <i class="fa-solid fa-user"></i>
      </div>
      <div className="input-box">
        {password ? (
          <label onClick={handleClickShowPassword}>
            <i class="fa-solid fa-eye"></i>
          </label>
        ) : (
          <i class="fa-solid fa-lock"></i>
        )}
        <input
          type={showPassword ? 'text' : 'password'}
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
        {loading ? (
          <img src="/spinner/LoadingSpinner.svg" alt="spinner" />
        ) : (
          'login'
        )}
      </button>

      <p className="register-login">
        Don't have an account? |<a href="/register"> Register</a>
      </p>
    </form>
  );
}
