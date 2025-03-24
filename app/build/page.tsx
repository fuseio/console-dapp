"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Home from "./Home";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { path } from "@/lib/helpers";

const Build = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [dispatch])

  useEffect(() => {
    if (!operatorSlice.isHydrated) return;
    
    if (operatorSlice.isAuthenticated) {
      router.replace(path.DASHBOARD)
    } else if (operatorSlice.isOperatorExist) {
      router.replace(path.BUILD_REGISTER)
    }
  }, [operatorSlice.isHydrated, operatorSlice.isAuthenticated, operatorSlice.isOperatorExist, router]);

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

export default Build;
