"use client";

import Topbar from "@/components/Topbar";
import Home from "./Home";
import Footer from "@/components/staking/Footer";
import ChainModal from "@/components/staking/ChainModal";

const Staking = () => {
  return (
    <div className="w-full font-mona justify-end">
      <div className="flex-col flex items-center bg-light-gray">
        <ChainModal />
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Staking;
