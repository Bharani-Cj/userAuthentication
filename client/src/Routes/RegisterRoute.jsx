import { useState } from 'react';
import { BsArrowLeftCircleFill } from 'react-icons/bs';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDOB] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [steps, setSteps] = useState(1);
  const [errors, setErrors] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const responce = await fetch(
      'https://user-authentication-8w3s.onrender.com/api/v1/signup',
      {
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
      }
    );
    const data = await responce.json();
    console.log(data);
    if (data.token) {
      window.location.href = '/';
    } else {
      setErrors(data);
      setLoading(false);
    }
  }

  function handleBack() {
    setSteps(steps > 1 ? steps - 1 : steps);
  }
  return (
    <div className="wrapper">
      <form className="formContainer" onSubmit={handleSubmit}>
        {steps <= 1 ? null : (
          <BsArrowLeftCircleFill className="navBack" onClick={handleBack} />
        )}
        <h1>Welcome</h1>
        {steps === 1 && (
          <>
            <UserName
              userName={userName}
              setUserName={setUserName}
              setErrors={setErrors}
            />
            <Email email={email} setEmail={setEmail} setErrors={setErrors} />
          </>
        )}
        {steps === 2 && (
          <DateOfBirth DOB={DOB} setDOB={setDOB} setErrors={setErrors} />
        )}
        {steps === 3 && (
          <Passwords
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setpasswordConfirm={setpasswordConfirm}
            setErrors={setErrors}
          />
        )}
        {errors.message ? <p className="painted">{errors.message}</p> : null}
        <Button
          steps={steps}
          setSteps={setSteps}
          setErrors={setErrors}
          loading={loading}
        />
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
}) {
  return (
    <>
      <div className="input-box">
        <input
          type="password"
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
        <input
          type="password"
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
    </div>
  );
}

function Button({ steps, setSteps, loading }) {
  function handleNextButton() {
    setSteps(steps + 1);
  }
  return (
    <>
      {steps >= 3 ? (
        <button type="submit" className="btn">
          {loading ? (
            <img src="/spinner/LoadingSpinner.svg" alt="spinner" />
          ) : (
            'SignIn'
          )}
        </button>
      ) : (
        <h2 className="btn" onClick={handleNextButton}>
          Next
        </h2>
      )}
    </>
  );
}

function LoginButton() {
  return (
    <div className="register-link">
      <p>
        Already have an account? | <a href="/">LogIn</a>
      </p>
    </div>
  );
}
