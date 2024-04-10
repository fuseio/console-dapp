import React from "react";
import maintain from "@/assets/maintain.svg";
import Image from "next/image";

const Maintenance = () => {
  return (
    <div className="flex flex-col main w-8/9 md:w-9/10 max-w-7xl md:flex-col h-[100vh] items-center">
      <div className="flex flex-col items-center text-[#4D4D4D] mt-52">
        <Image src={maintain} alt="Maintenance" className="w-[150px]" />
        <span className="text-[50px] font-semibold mt-10">Under Maintenance</span>
        <span className="text-base mt-5">
          The Bridge is under maintenance. We are working to fix the problem to
          restore functionality as soon as possible.
        </span>
      </div>
    </div>
  );
};

export default Maintenance;
