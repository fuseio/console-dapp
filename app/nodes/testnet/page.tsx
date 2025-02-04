"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import NoLicenseModal from "@/components/nodes/NoLicenseModal";

const Nodes = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("nodes"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <NoLicenseModal />
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default Nodes;
