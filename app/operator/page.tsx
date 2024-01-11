"use client";

import { useEffect } from "react";
import Topbar from "@/components/operator/Topbar";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/operator/Footer";
import { setHydrate } from "@/store/operatorSlice";

const Operator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("operator"));
    dispatch(setHydrate());
  }, [])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center h-screen">
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Operator;
