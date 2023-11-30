"use client";

import { useEffect } from "react";
import Home from "./Home";

import { useAppDispatch } from "@/store/store";
import { setSelectedNavbar } from "@/store/navbarSlice";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import ContactDetails from "./ContactDetails";
import Topbar from "@/components/dashboard/Topbar";

const Operator = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams()
  const contactDetails = searchParams.get('contact-details')

  useEffect(() => {
    dispatch(setSelectedNavbar("dashboard"));
  }, [])

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
