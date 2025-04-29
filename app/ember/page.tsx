"use client";

import {useEffect} from "react";

import {useAppDispatch} from "@/store/store";
import {setSelectedNavbar} from "@/store/navbarSlice";
import Topbar from "@/components/Topbar";

const Airdrop = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedNavbar("ember"));
  }, [dispatch]);

  return (
    <div className="font-mona w-full min-h-screen relative flex-col flex items-center bg-modal-bg isolate">
      <Topbar />
    </div>
  );
};

export default Airdrop;
