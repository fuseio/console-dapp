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

const Airdrop = () => {
  const dispatch = useAppDispatch();
  const {isConnected} = useAccount();
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("airdrop"));
  }, [dispatch])

  useEffect(() => {
    if (isConnected) {
      router.push(path.AIRDROP_PROFILE)
    }
  }, [isConnected, router]);

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray bg-[url('/vectors/airdrop-background.png')] bg-cover bg-center bg-no-repeat">
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Airdrop;
