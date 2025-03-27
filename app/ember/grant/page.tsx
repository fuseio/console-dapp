"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { retrieveAirdropUser } from "@/store/airdropSlice";

const AirdropFlash = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("ember"));
    dispatch(retrieveAirdropUser());
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen bg-light-gray isolate">
      <Topbar className="fixed backdrop-blur-sm md:mt-0" />
      <Home />
      <Footer />
    </div>
  );
};

export default AirdropFlash;
