"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "./Home";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import ChainModal from "@/components/ChainModal";
import PayModal from "@/components/billing/PayModal";
import BillingModal from "@/components/billing/BillingModal";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { path } from "@/lib/helpers";

const Billing = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("billing"));
  }, [dispatch])

  useEffect(() => {
    if(!operatorSlice.isAuthenticated && operatorSlice.isHydrated) {
      router.push(path.DASHBOARD);
    }
  }, [dispatch, operatorSlice.isAuthenticated, operatorSlice.isHydrated, router])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <ChainModal description="To work with the Operator account you must be connected to the Fuse Network" />
        <PayModal />
        <BillingModal />
        <Topbar />
        <Home />
        <Footer />
      </div>
    </div>
  );
};

export default Billing;
