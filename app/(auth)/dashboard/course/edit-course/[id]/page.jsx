"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCourse, updateCourse, setAuthToken } from "../../../../../../service/api";

function EditCoursePage({params}) {
  const router = useRouter();
  const { id } = params;  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }

        const response = await getCourse(id);
        const course = response.data;
        setTitle(course.title);
        setDescription(course.description);
        setDuration(course.duration);
      } catch (error) {
        setError("Failed to fetch course details");
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }

      const courseData = { title, description, duration };
      await updateCourse(id, courseData);

      // Redirect to the dashboard after successful update
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to update course");
      console.error("Error updating course:", error);
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
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">
              Update the form below to edit the course.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the course"
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Course Duration</Label>
                <Input
                  id="duration"
                  type="text"
                  placeholder="Enter duration in hours"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Update Course
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditCoursePage;
