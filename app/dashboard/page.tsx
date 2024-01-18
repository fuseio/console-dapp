"use client";

import { useEffect } from "react";
import Home from "./Home";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Topbar from "@/components/dashboard/Topbar";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { useAccount } from "wagmi";

const Operator = () => {
  const dispatch = useAppDispatch();
  const { isHydrated, isAuthenticated } = useAppSelector(selectOperatorSlice);
  const { isDisconnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [])

  useEffect(() => {
    if (isDisconnected || (isHydrated && !isAuthenticated)) {
      router.push("/");
    }
  }, [isDisconnected, isHydrated, isAuthenticated])

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
