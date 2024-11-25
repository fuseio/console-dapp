import React from "react";
import charge from "@/assets/charge.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full py-6 flex justify-center mt-3">
      <div className="flex justify-start items-center">
        <span className="font-medium text-sm">Powered by</span>
        <a href="https://chargeweb3.com/" target="_blank" rel="noreferrer">
          <Image src={charge} width={85} height={20} alt="logo" className="h-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
