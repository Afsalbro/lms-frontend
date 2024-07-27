"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStudent, updateStudent, setAuthToken } from "../../../../../../service/api"; 

function EditStudentPage({ params }) {
  const router = useRouter();
  const { id } = params;  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const response = await getStudent(id);
        const student = response.data;
        setName(student.name);
        setEmail(student.email);
      } catch (error) {
        setError("Failed to fetch student details");
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const studentData = { name, email };
      await updateStudent(id, studentData);

      // Redirect to the students list page after successful update
      router.push("/dashboard/students");
    } catch (error) {
      setError("Failed to update student");
      console.error("Error updating student:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen ml-6">
      <main className="container mx-auto my-12 px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Edit Student</h1>
            <p className="text-muted-foreground">
              Update the form below to edit the student details.
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
              Update Student
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditStudentPage;
