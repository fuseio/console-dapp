"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { retrieveAirdropUser, selectAirdropSlice } from "@/store/airdropSlice";

const AirdropFlash = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("rewards"));
    dispatch(retrieveAirdropUser());
  }, [dispatch])

  useEffect(() => {
    if (airdropSlice.isHydrated && !airdropSlice.isUser) {
      router.push(path.AIRDROP)
    }
  }, [airdropSlice.isHydrated, airdropSlice.isUser, router]);

  return (
    <div className="font-mona w-full min-h-screen bg-light-gray isolate">
      <Topbar className="fixed backdrop-blur-sm md:mt-0" />
      <Home />
      <Footer />
    </div>
  );
};

export default AirdropFlash;
