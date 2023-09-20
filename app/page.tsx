"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";

const Console = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("console"));
  }, [])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <Topbar />
        <Home />
      </div>
    </div>
  );
};

export default Console;
