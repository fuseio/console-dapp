"use client";

import Topbar from "@/components/ui/Topbar";
import Home from "./Home";

const Bridge = () => {
  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-full">
        <Topbar />
        <Home />
      </div>
    </div>
  );
};

export default Bridge;
