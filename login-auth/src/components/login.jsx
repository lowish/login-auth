import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth"
import { auth, googleProvider } from "@/firebase/firebase"

export function CardDemo({ onShowSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const user = cred?.user || auth.currentUser
      onLoginSuccess && onLoginSuccess(user)
    } catch (err) {
      setError(err?.message || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setInfo("")
    setIsSubmitting(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const user = cred?.user || auth.currentUser
      onLoginSuccess && onLoginSuccess(user)
    } catch (err) {
      setError(err?.message || "Google login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    
    // Validate email format
    if (!email) {
      setError("Enter your email first to reset password")
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    console.log("Sending password reset email to:", email)
    
    // Configure action code settings for password reset
    const actionCodeSettings = {
      url: `${window.location.origin}?mode=resetPassword`,
      handleCodeInApp: false, // Set to false to use default Firebase email link
    }
    
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        // Password reset email sent!
        console.log("Password reset email sent successfully to:", email)
        alert("Email sent! Please check your inbox (and spam folder).")
        setInfo("Password reset email sent. Please check your inbox and spam folder.")
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.error("Error sending password reset email:", errorCode, errorMessage)
        
        // Provide user-friendly error messages
        let userFriendlyMessage = errorMessage
        if (errorCode === "auth/user-not-found") {
          userFriendlyMessage = "No account found with this email address."
        } else if (errorCode === "auth/invalid-email") {
          userFriendlyMessage = "Invalid email address format."
        } else if (errorCode === "auth/too-many-requests") {
          userFriendlyMessage = "Too many requests. Please try again later."
        }
        
        setError(userFriendlyMessage)
        alert(`Error: ${userFriendlyMessage}`)
      })
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <p className="text-sm text-center mt-2 p-2">
        <CardTitle>Let's Get You In</CardTitle>
        </p>
        <p className="text-sm text-center mt-2 p-2">
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="lowishxx@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
            {info && (
              <p className="text-sm text-green-600" role="status">{info}</p>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Signing in" : "Sign in"}
        </Button>

        {/* Horizontal line */}
          <div className="w-full flex items-center my-2">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="mx-2 text-gray-400 text-sm font-medium">OR CONNECT WITH</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>

      <div className="flex gap-2 w-full">  
        <Button variant="outline" className="w-full" type="button" onClick={handleGoogle} disabled={isSubmitting}>
          Google
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><title>Google</title><path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={() => window.open("https://github.com/lowish", "_blank")}>
          Github
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </Button>
      </div>
        <p className="text-sm text-center text-muted-foreground mt-2">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-primary underline-offset-4 hover:underline font-medium"
            onClick={(e) => { e.preventDefault(); onShowSignup && onShowSignup(); }}
          >
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
