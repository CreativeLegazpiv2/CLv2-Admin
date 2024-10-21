"use client"

import React, { useState, FormEvent } from 'react'; // Import FormEvent
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from '@/services/login/login';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Type for error state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { // Explicitly type 'e'
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous error

    try {
      const result = await loginUser(username, password);
      console.log('Login successful:', result);
      // Handle successful login (e.g., redirect to admin dashboard)
    } catch (error: any) { // Optionally type the error
      console.error('Login failed:', error);
      setError(error.message); // Set the error message to display
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm text-lg border border-slate-300 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Creatives Admin.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-full hover:bg-slate-800 duration-300 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
