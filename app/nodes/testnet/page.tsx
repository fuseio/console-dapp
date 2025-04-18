"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import NoLicenseModal from "@/components/nodes/NoLicenseModal";
import NoCapacityModal from "@/components/nodes/NoCapacityModal";
import DelegateLicenseModal from "@/components/nodes/DelegateLicenseModal";
import RevokeLicenseModal from "@/components/nodes/RevokeLicenseModal";

const Nodes = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("nodes"));
  }, [dispatch])

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <NoLicenseModal />
      <NoCapacityModal />
      <DelegateLicenseModal />
      <RevokeLicenseModal />
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default Nodes;
