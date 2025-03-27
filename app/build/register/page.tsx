"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Home from "./Home";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
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
    }
  }, [operatorSlice.isHydrated, operatorSlice.isAuthenticated, router]);

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <Home />
    </div>
  );
};

export default Build;
