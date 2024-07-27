"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePenIcon, MenuIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getStudents, deleteStudent, setAuthToken } from "../../../../service/api"; // Ensure deleteStudent is imported
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const response = await getStudents();
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (deletingStudentId === null) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      await deleteStudent(deletingStudentId);
      setStudents(students.filter(student => student.id !== deletingStudentId));
      setDeletingStudentId(null);
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  return (
    <div className="w-screen ml-6">
      <header className="w-[97%] z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-lg font-semibold">Students</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students/add-student">
            <Button className="h-9 px-4 text-sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </header>
      <main className="p-4 md:p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription>Email: {student.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/students/edit-student/${student.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <FilePenIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <AlertDialog open={deletingStudentId === student.id} onOpenChange={(open) => { if (!open) setDeletingStudentId(null); }}>
                        <AlertDialogTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => setDeletingStudentId(student.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the student and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentsPage;
