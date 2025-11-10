import './App.css'
import React, { useState } from 'react'
import { CardDemo } from '@/components/login'
import Signup from '@/components/Signup'
import Success from '@/components/Success'
import ResetPassword from '@/components/ResetPassword'

function App() {
  const [showSignup, setShowSignup] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  const hasReset = mode === 'resetPassword' && params.get('oobCode')

  return (
    <div className="app-container">
      {hasReset ? (
        <ResetPassword onDone={() => {
          // Clear query params and go back to login view
          window.history.replaceState({}, document.title, window.location.pathname)
          setShowSignup(false)
        }} />
      ) : loggedIn ? (
        <Success name={userName} />
      ) : showSignup ? (
        <Signup onBack={() => setShowSignup(false)} />
      ) : (
        <CardDemo
          onShowSignup={() => setShowSignup(true)}
          onLoginSuccess={(user) => {
            const displayName = user?.displayName
            const email = user?.email || ""
            const fallback = email.includes('@') ? email.split('@')[0] : ""
            setUserName(displayName || fallback)
            setLoggedIn(true)
          }}
        />
      )}
    </div>
  )
}


export default App
