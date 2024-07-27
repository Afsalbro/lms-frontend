"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, setAuthToken } from "../../service/api"; 

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      const { token, role, name, email: userEmail } = response.data;

      setAuthToken(token);

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      localStorage.setItem('email', userEmail);

      // Redirect based on role
      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 my-20">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-primary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Sign in
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline" prefetch={false}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
