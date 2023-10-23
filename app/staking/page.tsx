"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";
import Footer from "@/components/Footer";
import ChainModal from "@/components/staking/ChainModal";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";

const Staking = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("staking"));
  }, [])

  return (
    <div className="w-full font-mona justify-end">
      <div className="flex-col flex items-center bg-light-gray">
        <ChainModal />
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Staking;
