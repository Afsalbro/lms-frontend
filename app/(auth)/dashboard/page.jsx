"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FilePenIcon, MenuIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { getCourses, deleteCourse, setAuthToken } from "../../../service/api";
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

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [userRole, setUserRole] = useState(""); // State to hold the user role

  useEffect(() => {
    async function fetchCourses() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const role = localStorage.getItem("role");
        setUserRole(role || ""); // Set user role from local storage

        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleDelete = async () => {
    if (!deletingCourseId) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      await deleteCourse(deletingCourseId);
      setCourses(courses.filter((course) => course.id !== deletingCourseId));
    } catch (error) {
      console.error("Failed to delete course", error);
    } finally {
      setDeletingCourseId(null);
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
          <h1 className="text-lg font-semibold">Courses</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Conditionally render the Add Course button based on user role */}
          {userRole === "admin" && (
            <Link href="/dashboard/course/add-course">
              <Button className="h-9 px-4 text-sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="p-4 md:p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <CardDescription>{course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Conditionally render Edit and Delete buttons based on user role */}
                      {userRole === "admin" && (
                        <>
                          <Link href={`/dashboard/course/edit-course/${course.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <FilePenIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>

                          <AlertDialog open={deletingCourseId === course.id} onOpenChange={(open) => { if (!open) setDeletingCourseId(null); }}>
                            <AlertDialogTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:bg-muted hover:text-foreground"
                                onClick={() => setDeletingCourseId(course.id)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the course and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
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

export default CoursesPage;
