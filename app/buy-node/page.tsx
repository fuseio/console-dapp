"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";

const BuyNode = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("buy node"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default BuyNode;
