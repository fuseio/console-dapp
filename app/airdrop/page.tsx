"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Topbar from "@/components/Topbar";

const Airdrop = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("airdrop"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen relative flex-col flex items-center bg-modal-bg isolate">
      <div className="absolute top-0 left-0 bg-linear-gradient-gray w-full h-[64.688rem] -z-10"></div>
      <Topbar />
      <Home />
    </div>
  );
};

export default Airdrop;
