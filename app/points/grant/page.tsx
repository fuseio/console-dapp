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

const AirdropGrant = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("points"));
    dispatch(retrieveAirdropUser());
  }, [dispatch])

  useEffect(() => {
    if (airdropSlice.isHydrated && !airdropSlice.isUser) {
      router.push(path.AIRDROP)
    }
  }, [airdropSlice.isHydrated, airdropSlice.isUser, router]);

  return (
    <div className="font-mona w-full min-h-screen bg-modal-bg isolate">
      <div className="absolute top-0 left-0 bg-linear-gradient-gray w-full h-[64.688rem] -z-10"></div>
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default AirdropGrant;
