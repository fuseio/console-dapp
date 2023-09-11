import React from "react";
import lzlogo from "@/public/lzlogo.png";
import ironblocks from "@/assets/ironblocks.svg";

const Footer = () => {
  return (
    <footer className="w-full py-6 flex justify-center mt-3">
      <div className="flex justify-start items-center">
        <span className="font-medium text-sm">Powered by</span>
        <a href="https://layerzero.network/" target="_blank" rel="noreferrer">
          <img src={lzlogo.src} alt="logo" className="ml-2 h-6" />
        </a>
      </div>
      <div className="flex justify-start items-center ml-6">
        <span className="font-medium text-sm">Monitoring by</span>
        <a href="https://www.ironblocks.com/" target="_blank" rel="noreferrer">
          <img src={ironblocks.src} alt="logo" className="ml-2 h-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
