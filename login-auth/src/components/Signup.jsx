import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/firebase/firebase"

export default function Signup({ onBack }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred?.user) {
        await updateProfile(cred.user, { displayName: name })
      }
      onBack && onBack()
    } catch (err) {
      setError(err?.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <p className="text-sm text-center mt-2">
        <CardTitle>Create an account</CardTitle>
        </p>
        <p className="text-sm text-center mt-2 p-2">
        <CardDescription>
          Enter your details to sign up
        </CardDescription>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Prince Tan" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="lowishxx@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Creating..." : "Create account"}
        </Button>
        <Button variant="outline" className="w-full" onClick={onBack}>Back</Button>
      </CardFooter>
    </Card>
  )
}
