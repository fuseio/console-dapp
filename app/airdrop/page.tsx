"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Topbar from "@/components/Topbar";
import { selectAirdropSlice } from "@/store/airdropSlice";

const Airdrop = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("airdrop"));
  }, [dispatch])

  useEffect(() => {
    if (airdropSlice.isUser) {
      router.push(path.AIRDROP_FOUNDATION)
    }
  }, [airdropSlice.isUser, router]);

  return (
    <div className="font-mona w-full min-h-screen relative flex-col flex items-center bg-modal-bg isolate">
      <div className="absolute top-0 left-0 bg-linear-gradient-gray w-full h-[64.688rem] -z-10"></div>
      <Topbar />
      <Home />
    </div>
  );
};

export default Airdrop;
