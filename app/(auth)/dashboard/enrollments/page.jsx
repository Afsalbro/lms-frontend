"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePenIcon, MenuIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getEnrollments, setAuthToken } from "../../../../service/api";
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

function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState(null);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const response = await getEnrollments();
        setEnrollments(response.data);
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      // Implement delete logic here
      // await deleteEnrollment(deletingEnrollmentId);

      // Remove the deleted enrollment from the state
      setEnrollments(enrollments.filter((e) => e.id !== deletingEnrollmentId));
      setDeletingEnrollmentId(null);
    } catch (error) {
      console.error("Failed to delete enrollment", error);
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
          <h1 className="text-lg font-semibold">Enrollment</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/enrollments/add-enrollment">
            <Button className="h-9 px-4 text-sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Enrollment
            </Button>
          </Link>
        </div>
      </header>
      <main className="p-4 md:p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <CardTitle>{enrollment.course.title}</CardTitle>
                  <CardDescription>
                    Student: {enrollment.student.name}
                    <br />
                    Email: {enrollment.student.email}
                    <br />
                    Course Description: {enrollment.course.description}
                    <br />
                    Duration: {enrollment.course.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/enrollments/edit-enrollment/${enrollment.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <FilePenIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <AlertDialog
                        open={deletingEnrollmentId === enrollment.id}
                        onOpenChange={(open) => {
                          if (!open) setDeletingEnrollmentId(null);
                        }}
                      >
                        <AlertDialogTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => setDeletingEnrollmentId(enrollment.id)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the enrollment and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
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

export default EnrollmentPage;
