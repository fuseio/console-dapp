import React from "react";
import lzlogo from "@/public/lzlogo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full py-6 flex justify-center mt-3">
      <div className="flex justify-start items-center">
        <span className="font-medium text-sm">Powered by</span>
        <a href="https://layerzero.network/" target="_blank" rel="noreferrer">
          <Image src={lzlogo} width={85} height={25} alt="logo" className="ml-2 h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
