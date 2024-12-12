import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import './primitiveui.css'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { firebaseMessaging, generateDeviceToken } from './services/firebase'
import { onMessage } from 'firebase/messaging'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  await generateDeviceToken();

  const root = createRoot(document.getElementById('root')!)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

start()
