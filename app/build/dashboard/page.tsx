"use client";

import { useEffect } from "react";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import ChainModal from "@/components/ChainModal";

const Operator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [dispatch])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <ChainModal description="To work with the Operator account you must be connected to the Fuse Network" />
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Operator;
