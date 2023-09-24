import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import close from "@/assets/close.svg";
import metamask from "@/public/metamask.png";
import wc from "@/assets/wc.svg";
import volt from "@/assets/volt.svg";
import coinbase from "@/assets/coinbase.svg";
import trezor from "@/public/trezor.png";
import fb from "@/assets/fb.svg";
import twitter2 from "@/assets/twitter2.svg";
import discord2 from "@/assets/discord2.svg";
import google from "@/assets/google.svg";
import twitch from "@/assets/twitch.svg";
import gh from "@/assets/gh.svg";
import arrow from "@/assets/back.svg";
import qr from "@/public/voltqrsample.png";
import { useAppDispatch } from "@/store/store";
import Image from "next/image";
import WalletButton from "./WalletButton";
import SocialButton from "./SocialButton";

interface WalletModalProps {
  isOpen: boolean;
  onToggle: (arg: boolean) => void;
  isLoading?: boolean;
}

const WalletModal = ({
  isOpen,
  onToggle,
  isLoading = false,
}: WalletModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<"HOME" | "VOLT">("HOME");
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        onToggle(false);
      }
    });
  }, [onToggle]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="modal-bg"
        >
          {selected == "HOME" ? (
            <motion.div
              initial={{ opacity: 0, top: "0" }}
              animate={{ opacity: 1, top: "50%" }}
              exit={{ opacity: 0, top: "0" }}
              transition={{
                duration: 0.3,
              }}
              className="bg-white h-[504px] w-[396px] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 items-center flex flex-col"
            >
              <span className="flex w-full justify-between items-start">
                <p className="text-[20px] font-bold">Connect Wallet</p>
                <Image
                  src={close}
                  alt="close"
                  className="cursor-pointer w-6"
                  onClick={() => onToggle(false)}
                />
              </span>
              <span className="text-sm pt-2">
                <p>
                  Connecting your wallet is like “logging in” to Web3. Select
                  your wallet from the options to get started.
                </p>
                <a
                  href="https://news.fuse.io/what-is-a-web3-wallet"
                  target="_blank"
                  className="text-[#1877F2] underline"
                >
                  What is Web3 wallet?
                </a>
              </span>
              <div className="grid grid-cols-3 w-full gap-2 pt-4">
                <WalletButton
                  icon={metamask}
                  text="MetaMask"
                  className="w-[35px]"
                />
                <WalletButton
                  icon={wc}
                  text="WalletConnect"
                  className="w-[35px]"
                />
                <WalletButton
                  icon={volt}
                  text="Volt"
                  className="h-[27px]"
                  onClick={() => {
                    setSelected("VOLT");
                  }}
                />
                <WalletButton
                  icon={coinbase}
                  text="Coinbase"
                  className="h-[30px]"
                />
                <WalletButton
                  icon={trezor}
                  text="Trezor"
                  className="h-[35px] w-[27px]"
                />
                <WalletButton
                  icon={metamask}
                  text="Metamask"
                  className="w-[35px] h-[35px]"
                />
              </div>
              <div className="flex pt-4 w-full justify-between text-[#9F9F9F] items-center text-[10px]">
                <hr className="w-[37%]" />
                <p>or connect with</p>
                <hr className="w-[37%]" />
              </div>
              <div className="grid grid-cols-3 w-full gap-2 pt-4">
                <SocialButton icon={fb} className="bg-[#C2D7F2]" />
                <SocialButton icon={twitter2} className="bg-[#E5F5FF]" />
                <SocialButton icon={discord2} className="bg-[#D8DAF0]" />
                <SocialButton icon={google} className="bg-[#F3F3F3]" />
                <SocialButton icon={twitch} className="bg-[#DBD8F0]" />
                <SocialButton icon={gh} className="bg-[#F3F3F3]" />
              </div>
              <div className="flex pt-4 w-full justify-between text-[#9F9F9F] items-center text-[10px]">
                <hr className="w-[40%]" />
                <p>or with email</p>
                <hr className="w-[40%]" />
              </div>
              <div className="flex w-full pt-3">
                <div className="flex bg-[#F2F2F2] p-2 rounded-md w-2/3">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="outline-none w-full bg-[#F2F2F2] text-xs p-1"
                  />
                </div>
                <button className="bg-black rounded-md w-1/3 text-xs font-medium ml-2 text-white">
                  Connect
                </button>
              </div>
            </motion.div>
          ) : selected == "VOLT" ? (
            <motion.div
              initial={{ opacity: 0, top: "0" }}
              animate={{ opacity: 1, top: "50%" }}
              exit={{ opacity: 0, top: "0" }}
              transition={{
                duration: 0.3,
              }}
              className="bg-white h-[504px] w-[396px] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 items-center flex flex-col bg-gradient-to-b from-white to-[#5ED73E]"
            >
              <span className="flex w-full justify-between items-start">
                <span
                  className="text-sm font-medium cursor-pointer flex"
                  onClick={() => {
                    setSelected("HOME");
                  }}
                >
                  <Image src={arrow} alt="close" className="mr-2" />
                  Back
                </span>
                <Image
                  src={close}
                  alt="close"
                  className="cursor-pointer w-6"
                  onClick={() => onToggle(false)}
                />
              </span>
              <div className="w-full flex flex-col h-full justify-center items-center">
                <p className="text-[20px] font-bold">Scan with your Volt app</p>
                <Image src={qr} alt="qr" />
              </div>
            </motion.div>
          ) : (
            <></>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default WalletModal;
