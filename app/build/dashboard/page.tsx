"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Home from "./Home";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import ChainModal from "@/components/ChainModal";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { path } from "@/lib/helpers";

const Operator = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [dispatch])

  useEffect(() => {
    if (operatorSlice.isHydrated && !operatorSlice.isAuthenticated) {
      router.push(path.BUILD)
    }
  }, [operatorSlice.isHydrated, operatorSlice.isAuthenticated, router]);

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
