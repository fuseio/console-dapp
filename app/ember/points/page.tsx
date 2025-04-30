"use client";
import {useEffect} from "react";
import {useAppDispatch} from "@/store/store";
import {setSelectedNavbar} from "@/store/navbarSlice";
import Home from "./Home";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import WaitlistModal from "@/components/airdrop/WaitlistModal";
import {retrieveAirdropUser} from "@/store/airdropSlice";
import QuestModal from "@/components/airdrop/QuestModal";
import ClaimTestnetFuseModal from "@/components/airdrop/ClaimTestnetFuseModal";
import TwitterErrorModal from "@/components/airdrop/TwitterErrorModal";

const AirdropEcosystem = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("ember"));
    dispatch(retrieveAirdropUser());
  }, [dispatch]);

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
