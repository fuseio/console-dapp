"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";

const Build = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <Home />
    </div>
  );
};

export default Build;
