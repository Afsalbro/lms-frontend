"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEnrollment, getStudents, getCourses, updateEnrollment, setAuthToken } from "../../../../../../service/api";

function EditEnrollmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const [studentsResponse, coursesResponse, enrollmentResponse] = await Promise.all([
          getStudents(),
          getCourses(),
          getEnrollment(id)
        ]);

        setStudents(studentsResponse.data);
        setCourses(coursesResponse.data);

        const enrollment = enrollmentResponse.data;
        setSelectedStudent(enrollment.student_id);
        setSelectedCourse(enrollment.course_id);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const enrollmentData = {
        student_id: selectedStudent,
        course_id: selectedCourse
      };

      await updateEnrollment(id, enrollmentData);

      // Redirect to the enrollment list after successful update
      router.push("/dashboard/enrollments");
    } catch (error) {
      setError("Failed to update enrollment");
      console.error("Error updating enrollment:", error);
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
            <h1 className="text-3xl font-bold">Edit Enrollment</h1>
            <p className="text-muted-foreground">
              Update the details below to modify the enrollment.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-[100%]">
                    {selectedStudent
                      ? students.find(student => student.id === selectedStudent)?.name || "Select student"
                      : "Select student"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Students</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {students.map((student) => (
                      <DropdownMenuItem
                        key={student.id}
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        {student.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-[100%]">
                    {selectedCourse
                      ? courses.find(course => course.id === selectedCourse)?.title || "Select course"
                      : "Select course"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Courses</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {courses.map((course) => (
                      <DropdownMenuItem
                        key={course.id}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        {course.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Update Enrollment
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditEnrollmentPage;
