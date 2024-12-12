import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { googleSignIn, selectAuthError } from './authSlice';
import { emailLogin } from './authSlice';

interface LoginPageFormFields extends HTMLFormControlsCollection {
  email: HTMLSelectElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const LoginPage = () => {
  const [loginReqStatus, setLoginReqStatus] = useState<'idle' | 'pending'>('idle');

  const authError = useAppSelector(selectAuthError);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;
    const email = elements.email.value;
    const password = elements.password.value;

    const form = e.currentTarget;

    try {
      setLoginReqStatus('pending');

      await dispatch(emailLogin({ email, password })).unwrap();
      navigate('/channels');
      form.reset();
    } catch (error) {
      alert(`An error occurred\nWrong credentials`);
    } finally {
      setLoginReqStatus('idle');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoginReqStatus('pending');
      await dispatch(googleSignIn()).unwrap();
      navigate('/channels');
      setLoginReqStatus('idle');
    } catch (error) {
      alert('Error while signing in with Google.');
      console.log(error);
    } finally {
      setLoginReqStatus('idle');
    }
  };

  return (
    <section>
      <h2>Welcome to Channel Messaging!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="text" />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button disabled={loginReqStatus === 'pending'}>Log In</button>
          <button type="button" onClick={() => navigate('/SignUp')}>Create an account</button>
        </div>
      </form>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <h4>Or sign in with:</h4>
        <button
          onClick={handleGoogleSignIn}
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sign in with Google
        </button>
        <button
          id='phone-sign-in-button'
          onClick={() => navigate('/phoneSignIn')}
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '10px 20px',
            backgroundColor: '#34A853',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sign in with Phone
        </button>
      </div>
    </section>
  );
};
