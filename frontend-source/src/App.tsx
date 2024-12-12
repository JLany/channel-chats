import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { useAppSelector } from './app/hooks'
import { selectCurrentUserId } from './features/auth/authSlice'
import { LoginPage } from './features/auth/LoginPage'
import { SignUpPage } from './features/auth/SignUpPage'
import { ChannelsMainPage } from './features/channels/ChannelsMainPage'
import { AddChannelForm } from './features/channels/AddChannelForm'
import { PhoneSignIn } from './features/auth/PhoneSignIn';

import { useEffect } from 'react'
import { onMessage } from 'firebase/messaging'
import { firebaseMessaging } from './services/firebase'

interface ProtectdRouteProps {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectdRouteProps) => {
  const userId = useAppSelector(selectCurrentUserId);

  if (!userId) {
    console.log('challenge...');
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    children
  );
}

function App() {

  onMessage(firebaseMessaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
    alert('WTF!');
  });

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/"
            element={
              <LoginPage />
            }
          >
          </Route>
          <Route path="/SignUp"
            element={
              <SignUpPage />
            }
          >
          </Route>
          <Route path="/phoneSignIn"
            element={
              <PhoneSignIn />
            }
          >
          </Route>
          <Route path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/channels"
                    element={
                      <ChannelsMainPage />
                    }
                  >
                  </Route>
                  <Route path="/channels/create"
                    element={
                      <AddChannelForm />
                    }
                  >
                  </Route>
                </Routes>
              </ProtectedRoute>
            }>
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
