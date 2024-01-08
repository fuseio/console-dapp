"use client";

import { useEffect } from "react";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import ContactDetails from "./ContactDetails";
import Topbar from "@/components/dashboard/Topbar";
import { useAccount } from "wagmi";

const Operator = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams()
  const contactDetails = searchParams.get('contact-details')
  const { isDisconnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    dispatch(setSelectedNavbar("dashboard"));
  }, [])

  useEffect(() => {
    if(isDisconnected) {
      router.push("/");
    }
  }, [isDisconnected])

  return (
    <div className="w-full font-mona justify-end min-h-screen">
      <div className="flex-col flex items-center bg-light-gray h-screen">
        <Topbar />
        {contactDetails ?
          <ContactDetails /> :
          <Home />
        }
        <Footer />
      </div>
    </div>
  );
};

export default Operator;
