"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { BookAIcon, Calendar, DoorOpen, User2Icon } from "lucide-react";
import { logout } from "../../service/api";

const TABS = {
  COURSES: "courses",
  STUDENTS: "students",
  ENROLLMENTS: "enrollments",
};

const TAB_CONFIG = {
  courses: {
    icon: BookAIcon,
    tooltip: "Courses",
    href: "/dashboard",
  },
  students: {
    icon: User2Icon,
    tooltip: "Students",
    href: "/dashboard/students",
  },
  enrollments: {
    icon: Calendar,
    tooltip: "Enrollments",
    href: "/dashboard/enrollments",
  },
};

export function SideNav() {
  const router = useRouter();
  const userRole = localStorage.getItem("role"); // Retrieve user role from local storage

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const tabsToRender = userRole === "admin"
    ? Object.keys(TABS)
    : ["courses"]; 

  return (
    <div className="flex w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <div className="flex h-[72px] shrink-0 items-center justify-center border-b px-2 sm:px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Acme LMS</span>
          </Link>
        </div>
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            {tabsToRender.map((key) => {
              const { icon: Icon, tooltip, href } = TAB_CONFIG[key.toLowerCase()];
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{tooltip}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{tooltip}</TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <DoorOpen className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
    </div>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
