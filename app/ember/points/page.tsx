"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import WaitlistModal from "@/components/airdrop/WaitlistModal";
import { retrieveAirdropUser, selectAirdropSlice } from "@/store/airdropSlice";
import QuestModal from "@/components/airdrop/QuestModal";
import ClaimTestnetFuseModal from "@/components/airdrop/ClaimTestnetFuseModal";
import TwitterErrorModal from "@/components/airdrop/TwitterErrorModal";

const AirdropEcosystem = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("ember"));
    dispatch(retrieveAirdropUser());
  }, [dispatch])

  useEffect(() => {
    if (airdropSlice.isHydrated && !airdropSlice.isUser) {
      router.push(path.AIRDROP)
    }
  }, [airdropSlice.isHydrated, airdropSlice.isUser, router]);

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <QuestModal />
      <WaitlistModal />
      <ClaimTestnetFuseModal />
      <TwitterErrorModal />
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default AirdropEcosystem;
