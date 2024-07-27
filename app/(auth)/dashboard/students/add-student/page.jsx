"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createStudent, setAuthToken } from "../../../../../service/api"; 

function AddStudentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const studentData = { name, email };
      await createStudent(studentData);
      router.push("/dashboard/students");
    } catch (error) {
      setError("Failed to add student");
      console.error("Error adding student:", error);
    }
  };

  return (
    <div className="w-screen ml-6">
      <main className="container mx-auto my-12 px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Add New Student</h1>
            <p className="text-muted-foreground">
              Fill out the form below to create a new student.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Student Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Save Student
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddStudentPage;
