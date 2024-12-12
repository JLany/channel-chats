import React, { useState } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/services/firebase';
import { userSignedIn } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';

interface Win extends Window {
  recaptchaVerifier?: any;
}

declare var grecaptcha: {
  reset: (widgetId: number) => void;
};

export const PhoneSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isCodeFieldDisabled, setIsCodeFieldDisabled] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const initializeRecaptcha = () => {
    const win = window as Win;
    if (!win.recaptchaVerifier) {
      win.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'error-callback': (err) => {
          console.error('reCAPTCHA failed:', err);
        },
      });
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.startsWith('+')) {
      alert('Please enter your phone number in E.164 format (e.g., +14155552671)');
      return;
    }

    initializeRecaptcha();

    const win = window as Win;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, win.recaptchaVerifier);
      setConfirmationResult(result);
      setIsCodeFieldDisabled(false);
      alert('Confirmation code sent. Please check your phone.');
    } catch (error) {
      console.error('Error during phone number sign-in:', error);
      alert('Failed to send confirmation code. Please try again.');
      win.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    }
  };

  const handleCodeSubmit = async () => {
    if (!confirmationResult) {
      alert('Please submit your phone number first.');
      return;
    }
    
    const win = window as Win;

    try {
      const userCredential = await confirmationResult.confirm(confirmationCode);
      console.log('User signed in successfully:', userCredential.user);
      alert('Phone number verified successfully!');
      const token = userCredential.user.accessToken;


      dispatch(userSignedIn({
        userId: userCredential.user.uid,
        username: phoneNumber,
        token
      }));
      navigate('/channels');
    } catch (error) {
      console.error('Error during code verification:', error);
      alert('Invalid confirmation code. Please try again.');
      win.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    }
  };

  return (
    <section style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign in with Phone</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number:</label>
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number (E.164 format)"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handlePhoneSubmit}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Send Confirmation Code
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="confirmationCode" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmation Code:</label>
        <input
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter the confirmation code"
          disabled={isCodeFieldDisabled}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: isCodeFieldDisabled ? '#f9f9f9' : 'white' }}
        />
        <button
          onClick={handleCodeSubmit}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: isCodeFieldDisabled ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isCodeFieldDisabled ? 'not-allowed' : 'pointer' }}
          disabled={isCodeFieldDisabled}
        >
          Verify Code
        </button>
      </div>

      <div id="recaptcha-container"></div>
    </section>
  );
};
