"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { selectAirdropSlice } from "@/store/airdropSlice";

const AirdropLeaderboard = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("ember"));
  }, [dispatch])

  useEffect(() => {
    if (airdropSlice.isHydrated && !airdropSlice.isUser) {
      router.push(path.AIRDROP)
    }
  }, [airdropSlice.isHydrated, airdropSlice.isUser, router]);

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default AirdropLeaderboard;
