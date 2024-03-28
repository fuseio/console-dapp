"use client";

import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import Home from "./Home";
import ChainModal from "@/components/ChainModal";
import Footer from "@/components/Footer";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";

const PageWrapper = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("staking"));
  }, [])

  return (
    <div className="w-full font-mona justify-end">
      <div className="flex-col flex items-center bg-light-gray">
        <ChainModal />
        <Topbar />
        <Home params={params} />
        <Footer />
      </div>
    </div>
  );
};

export default PageWrapper;
