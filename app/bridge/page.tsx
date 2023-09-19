"use client";

import Topbar from "@/components/Topbar";
import Home from "./Home";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { setSelectedNavbar } from "@/store/navbarSlice";

const Bridge = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("bridge"));
  }, [])

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
