"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { register } from "../../service/api";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      const { token, role } = response.data;

      // Store the token and user details in localStorage or context
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error.response ? error.response.data : "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-[400px] space-y-6 my-20">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-muted-foreground">
          Create your account to get started.
        </p>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline" prefetch={false}>
          Login
        </Link>
      </div>
    </div>
  );
}
