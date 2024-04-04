"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Topbar from "@/components/Topbar";
import Home from "./Home";
import Footer from "@/components/Footer";

const Console = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar(""));
  }, [dispatch])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Console;
