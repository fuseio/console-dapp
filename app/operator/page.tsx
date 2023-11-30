"use client";

import { useEffect } from "react";
import Topbar from "@/components/operator/Topbar";
import Home from "./Home";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { hex } from "@/lib/helpers";
import { useRouter } from "next/navigation";

const Operator = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("operator"));
  }, [])

  useEffect(() => {
    if(operatorSlice.address !== hex) {
      router.push("/dashboard")
    }
  }, [operatorSlice.address])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Operator;
