"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { path } from "@/lib/helpers";
import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";

const AirdropLeaderboard = () => {
  const dispatch = useAppDispatch();
  const {isConnected} = useAccount();
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("airdrop"));
  }, [dispatch])

  useEffect(() => {
    if (!isConnected) {
      router.push(path.AIRDROP)
    }
  }, [isConnected, router]);

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-full">
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default AirdropLeaderboard;
