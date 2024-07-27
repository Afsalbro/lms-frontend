import { SideNav } from "@/components/component/side-nav";
import React from "react";

function layout({ children }) {
  return (
    <div className="w-screen">
      <div className="grid grid-cols-1">
        <SideNav />
      </div>
      <div className="grid grid-cols-3 ml-4 p-4">{children}</div>
    </div>
  );
}

export default layout;
