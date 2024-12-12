import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/app/hooks';
import { emailSignUp } from './authSlice';

interface SignupPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
}
interface SignupPageFormElements extends HTMLFormElement {
  readonly elements: SignupPageFormFields;
}

export const SignUpPage = () => {
  const [signUpReqStatus, setSignUpReqStatus] = useState<'idle' | 'pending'>('idle');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<SignupPageFormElements>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;
    const email = elements.email.value;
    const password = elements.password.value;
    const confirmPassword = elements.confirmPassword.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const form = e.currentTarget;

    try {
      setSignUpReqStatus('pending');

      await dispatch(emailSignUp({ email, password })).unwrap();
      navigate('/channels');
      form.reset();
    } catch (error) {
      alert('An error occurred during signup. Please try again.');
    } finally {
      setSignUpReqStatus('idle');
    }
  };

  return (
    <section>
      <h2>Create an Account</h2>
      <h3>Please sign up:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" required />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" required />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input id="confirmPassword" type="password" required />

        <button disabled={signUpReqStatus === 'pending'} >Sign Up</button>
      </form>
      <button onClick={() => navigate('/')}>Already have an account? Log In</button>
    </section>
  );
};
