"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Topbar from "@/components/Topbar";
import Home from "@/app/ai-agent/Home";
import Footer from "@/components/Footer";

const AIAgent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("ai-agent"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default AIAgent;
