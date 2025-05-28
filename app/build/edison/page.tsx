"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Topbar from "@/components/Topbar";
import Home from "@/app/build/edison/Home";
import Footer from "@/components/Footer";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { path } from "@/lib/helpers";
import SubMenu from "@/components/build/SubMenu";

const AIAgent = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("build"));
  }, [dispatch])

  useEffect(() => {
    if (!operatorSlice.isHydrated) return;
    if (!operatorSlice.isAuthenticated) {
      router.replace(path.BUILD)
    }
  }, [operatorSlice.isHydrated, operatorSlice.isAuthenticated, router]);

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <div className="w-8/9 my-[30.84px] md:my-12 md:w-9/10 max-w-7xl mx-auto">
        <SubMenu selected="use edison ai" />
      </div>
      <Home />
      <Footer />
    </div>
  );
};

export default AIAgent;
