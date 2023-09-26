import React, { useEffect, useState } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import ReactGA from "react-ga4";
import { setWeb3OnboardProvider } from "@/lib/provider";
import { EIP1193Provider } from "@web3-onboard/core";
import { useAppDispatch } from "@/store/store";
import { fetchValidators } from "@/store/validatorSlice";
import fuseLogo from "@/assets/fuseToken.svg";
import copy from "@/assets/copy-black.svg";
import exit from "@/assets/sign-out.svg";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import down from "@/assets/dropdown-down.svg";

const menu: Variants = {
  closed: {
    opacity: 0,
    transition: {
      delay: 0.15,
      duration: 0.3,
    },
    y: -50,
    transitionEnd: {
      display: "none",
    },
  },
  open: {
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      duration: 0.5,
    },
    y: 0,
  },
};

const ConnectWallet = ({
  disableAccountCenter = false,
  className = "",
}: {
  disableAccountCenter?: boolean;
  className?: string;
}) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const [connected, setConnected] = useState(false);
  const dispatch = useAppDispatch();
  const [isChainOpen, setIsChainOpen] = React.useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = React.useState(false);
  const chainRef = useOutsideClick(() => {
    if (isChainOpen) {
      setIsChainOpen(false);
    }
  });
  const accountsRef = useOutsideClick(() => {
    if (isAccountsOpen) {
      setIsAccountsOpen(false);
    }
  });
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    setWeb3OnboardProvider(wallet?.provider as EIP1193Provider);
    dispatch(fetchValidators());
    connectionEvent(wallet);
  }, [wallet, connectedChain]);

  const connectionEvent = (wallet: any) => {
    if (wallet)
      ReactGA.event({
        category: "Connection",
        action: "Connecting wallet",
        label: wallet?.label,
      });
  };

  return !connected ? (
    <button
      className={
        wallet
          ? "hidden"
          : "bg-fuse-black text-white px-4 py-2 rounded-full font-medium md:text-sm " +
            className
      }
      onClick={() => {
        wallet ? disconnect(wallet) : connect();
      }}
    >
      {wallet
        ? "Disconnect Wallet"
        : connecting
        ? "Connecting..."
        : "Connect Wallet"}
    </button>
  ) : !disableAccountCenter ? (
    <div className="flex relative min-w-[330px]">
      <div
        className={`flex bg-white px-[10px] py-[6px] rounded cursor-pointer items-center relative text-[10px] font-medium border-[1px] ${
          isChainOpen ? "border-fuse-green-light" : "border-white"
        }`}
        ref={chainRef}
        onClick={() => setIsChainOpen(!isChainOpen)}
      >
        <div className="flex w-full justify-center">
          <Image
            src={fuseLogo.src}
            alt="Fuse"
            className="me-2"
            width={17}
            height={17}
          />
          <p className="text-[10px]/[20px]">Fuse Mainnet</p>
          <Image
            src={down.src}
            alt="down"
            className={`mx-2 ${isChainOpen && "rotate-180"}`}
            width={10}
            height={10}
          />
        </div>
      </div>
      <div
        className={`flex bg-white p-[2px] rounded cursor-pointer items-center relative font-medium border-[1px] ml-2 ${
          isAccountsOpen ? "border-fuse-green-light" : "border-white"
        }`}
        ref={accountsRef}
        onClick={() => setIsAccountsOpen(!isAccountsOpen)}
      >
        <div className="flex w-full justify-center">
          <div className="h-full px-[10px] py-[7px] bg-modal-bg rounded text-[10px]/[17px]">
            0.444 FUSE
          </div>
          <Image
            src={fuseLogo.src}
            alt="Fuse"
            className="mx-2"
            width={17}
            height={17}
          />
          <p className="text-[10px]/[30px]">0x49839....232</p>
          <Image
            src={down.src}
            alt="down"
            className={`mx-2 ${isAccountsOpen && "rotate-180"}`}
            width={10}
            height={10}
          />
        </div>
        <motion.div
          animate={isAccountsOpen ? "open" : "closed"}
          initial="closed"
          exit="closed"
          variants={menu}
          className="absolute top-[120%] left-0 bg-white rounded shadow-xl p-[6px] z-50 w-full text-[10px]/[20px] font-medium"
        >
          <div className="flex items-center px-[6px] rounded">
            <Image
              src={fuseLogo.src}
              alt={"Fuse"}
              className="h-8 me-2"
              width={15}
              height={15}
            />
            <p>0.444343 FUSE</p>
            <p className="ml-auto">0x7589....344</p>
          </div>
          <div className="bg-modal-bg w-full rounded px-[9px] py-[7px] flex">
            Copy address
            <Image
              src={copy.src}
              alt="copy"
              className="ml-auto"
              width={15}
              height={15}
            />
          </div>
          <div className="bg-[#FD0F0F] text-white w-full rounded px-[9px] py-[7px] flex mt-1">
            Disconnect
            <Image
              src={exit.src}
              alt="exit"
              className="ml-auto"
              width={15}
              height={15}
            />
          </div>
        </motion.div>
      </div>
      <motion.div
        animate={isChainOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className="absolute top-[120%] bg-white rounded shadow-xl p-[6px] z-50 text-[10px]/[20px] font-medium"
      >
        <div
          className={
            selected == 0
              ? "flex items-center px-[6px] bg-modal-bg rounded cursor-pointer"
              : "flex items-center px-[6px] cursor-pointer"
          }
          onClick={() => {}}
          key={0}
        >
          <Image
            src={fuseLogo.src}
            alt={"Fuse"}
            className="h-8 me-2"
            width={15}
            height={15}
          />
          <p>Fuse Mainnet</p>
          {selected == 0 && (
            <>
              <div className="h-[6px] w-[6px] rounded-full bg-[#66E070] ml-7" />
              <p className="text-[8px] font-medium ml-1">Connected</p>
            </>
          )}
        </div>
        <div className="flex items-center px-[6px]" onClick={() => {}} key={0}>
          <Image
            src={fuseLogo.src}
            alt={"Fuse"}
            className="h-8 me-2"
            width={15}
            height={15}
          />
          <p className="font-medium cursor-pointer">Fuse Mainnet</p>
        </div>
      </motion.div>
    </div>
  ) : (
    <></>
  );
};

export default ConnectWallet;
