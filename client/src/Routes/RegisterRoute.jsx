import { useState } from 'react';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDOB] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [errors, setErrors] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const responce = await fetch('https://user-authentication-8w3s.onrender.com/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName,
        email,
        DOB,
        password,
        passwordConfirm,
      }),
    });
    const data = await responce.json();
    console.log(data);
    if (data.token) {
      window.location.href = '/';
    } else {
      setErrors(data);
      setLoading(false);
    }
  }

  return (
    <div className="wrapper">
      <form className="formContainer" onSubmit={handleSubmit}>
        <h1>Welcome</h1>

        <UserName userName={userName} setUserName={setUserName} setErrors={setErrors} />
        <Email email={email} setEmail={setEmail} setErrors={setErrors} />

        <DateOfBirth DOB={DOB} setDOB={setDOB} setErrors={setErrors} />

        <Passwords
          password={password}
          setPassword={setPassword}
          passwordConfirm={passwordConfirm}
          setpasswordConfirm={setpasswordConfirm}
          setErrors={setErrors}
          handleClickShowPassword={handleClickShowPassword}
          showPassword={showPassword}
        />

        {errors.message ? <p className="painted">{errors.message}</p> : null}
        <Button setErrors={setErrors} loading={loading} />
        <LoginButton />
      </form>
    </div>
  );
}

function Email({ email, setEmail, setErrors }) {
  return (
    <div className="input-box">
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => {
          setErrors('');
          setEmail(e.target.value);
        }}
      />
      <i class="fa-solid fa-envelope"></i>
    </div>
  );
}

function DateOfBirth({ DOB, setDOB, setErrors }) {
  return (
    <div className="input-box">
      <input
        type="Date"
        placeholder="Date of birth"
        required
        value={DOB}
        onChange={(e) => {
          setErrors('');
          setDOB(e.target.value);
        }}
      />
    </div>
  );
}

function Passwords({
  password,
  setPassword,
  passwordConfirm,
  setpasswordConfirm,
  setErrors,
  handleClickShowPassword,
  showPassword,
}) {
  return (
    <>
      <div className="input-box">
        {password ? (
          <label onClick={handleClickShowPassword}>
            <i class="fa-solid fa-eye"></i>
          </label>
        ) : (
          <i class="fa-solid fa-lock"></i>
        )}
        <input
          type={showPassword ? 'type' : 'password'}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => {
            setErrors('');
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="input-box">
        <i class="fa-solid fa-lock"></i>
        <input
          type={showPassword ? 'type' : 'password'}
          placeholder="Confirm Password"
          required
          value={passwordConfirm}
          onChange={(e) => {
            setErrors('');
            setpasswordConfirm(e.target.value);
          }}
        />
      </div>
    </>
  );
}

function UserName({ userName, setUserName, setErrors }) {
  return (
    <div className="input-box">
      <input
        type="userName"
        placeholder="Username"
        required
        value={userName}
        onChange={(e) => {
          setErrors('');
          setUserName(e.target.value);
        }}
      />
      <i class="fa-solid fa-user"></i>
    </div>
  );
}

function Button({ loading }) {
  return (
    <button type="submit" className="btn">
      {loading ? <img src="/spinner/LoadingSpinner.svg" alt="spinner" /> : 'Sign Up'}
    </button>
  );
}

function LoginButton() {
  return (
    <div className="register-login">
      <p>
        Already have an account? | <a href="/">LogIn</a>
      </p>
    </div>
  );
}
