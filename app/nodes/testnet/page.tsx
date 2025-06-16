"use client";

import {useEffect} from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";

import {useAppDispatch, useAppSelector} from "@/store/store";
import {setSelectedNavbar} from "@/store/navbarSlice";
import {selectNodesSlice, setIsChainModalOpen} from "@/store/nodesSlice";
import {useChainId} from "wagmi";
import {fuse} from "viem/chains";
import Footer from "@/components/Footer";
import NoLicenseModal from "@/components/nodes/NoLicenseModal";
import NoCapacityModal from "@/components/nodes/NoCapacityModal";
import DelegateLicenseModal from "@/components/nodes/DelegateLicenseModal";
import RevokeLicenseModal from "@/components/nodes/RevokeLicenseModal";
import ChainModal from "@/components/ChainModal";

const Nodes = () => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const chainId = useChainId();

  useEffect(() => {
    dispatch(setSelectedNavbar("nodes"));
  }, [dispatch]);

  // Auto-close chain modal when switched to Fuse chain
  useEffect(() => {
    if (nodesSlice.isChainModalOpen && chainId === fuse.id) {
      dispatch(setIsChainModalOpen(false));
    }
  }, [chainId, nodesSlice.isChainModalOpen, dispatch]);

  return (
    <div className="font-mona w-full min-h-screen flex-col flex items-center bg-light-gray">
      <ChainModal
        description="Please switch to the Fuse Network to delegate licenses"
        isOpen={nodesSlice.isChainModalOpen}
        onClose={() => dispatch(setIsChainModalOpen(false))}
      />
      <NoLicenseModal />
      <NoCapacityModal />
      <DelegateLicenseModal />
      <RevokeLicenseModal />
      <Topbar />
      <Home />
      <Footer />
    </div>
  );
};

export default Nodes;
