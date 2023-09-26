import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/store";
import { fetchValidators } from "@/store/validatorSlice";
import fuseLogo from "@/assets/fuseToken.svg";
import copy from "@/assets/copy-black.svg";
import exit from "@/assets/sign-out.svg";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import down from "@/assets/dropdown-down.svg";
import { useAccount, useBalance, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { eclipseAddress } from "@/lib/helpers";

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
  const dispatch = useAppDispatch();
  const [isChainOpen, setIsChainOpen] = React.useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = React.useState(false);
  const { address, connector, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { disconnect } = useDisconnect();
  const balance = useBalance({
    address,
    watch: true,
  })

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

  useEffect(() => {
    dispatch(fetchValidators());
  }, [connector, chain]);

  return !isConnected ? (
    <button
      className={
        "bg-fuse-black text-white px-4 py-2 rounded-full font-medium md:text-sm " +
        className
      }
      onClick={() => dispatch(setIsWalletModalOpen(true))}
    >
      Connect Wallet
    </button>
  ) : !disableAccountCenter ? (
    <div className="flex relative min-w-[330px]">
      <div
        className={`flex bg-white px-[10px] py-[6px] rounded cursor-pointer items-center relative text-[10px] font-medium border-[1px] ${isChainOpen ? "border-fuse-green-light" : "border-white"
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
          <p className="text-[10px]/[20px]">{chain?.name}</p>
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
        className={`flex bg-white p-[2px] rounded cursor-pointer items-center relative font-medium border-[1px] ml-2 ${isAccountsOpen ? "border-fuse-green-light" : "border-white"
          }`}
        ref={accountsRef}
        onClick={() => setIsAccountsOpen(!isAccountsOpen)}
      >
        <div className="flex w-full justify-center">
          <div className="h-full px-[10px] py-[7px] bg-modal-bg rounded text-[10px]/[17px]">
            {balance.data?.formatted} {balance.data?.symbol}
          </div>
          <Image
            src={fuseLogo.src}
            alt="Fuse"
            className="mx-2"
            width={17}
            height={17}
          />
          <p className="text-[10px]/[30px]">{eclipseAddress(String(address))}</p>
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
            <p>{balance.data?.formatted} {balance.data?.symbol}</p>
            <p className="ml-auto">{eclipseAddress(String(address))}</p>
          </div>
          <div className="bg-modal-bg w-full rounded px-[9px] py-[7px] flex"
            onClick={() => {
              navigator.clipboard.writeText(String(address));
            }}
          >
            Copy address
            <Image
              src={copy.src}
              alt="copy"
              className="ml-auto"
              width={15}
              height={15}
            />
          </div>
          <div
            className="bg-[#FD0F0F] text-white w-full rounded px-[9px] py-[7px] flex mt-1"
            onClick={() => disconnect()}
          >
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
        {chains.map((c) =>
          <div
            className={
              chain?.id === c.id
                ? "flex items-center px-[6px] bg-modal-bg rounded cursor-pointer"
                : "flex items-center px-[6px] cursor-pointer"
            }
            onClick={() => {switchNetwork && switchNetwork(c.id)}}
            key={c.id}
          >
            <Image
              src={fuseLogo.src}
              alt={"Fuse"}
              className="h-8 me-2"
              width={15}
              height={15}
            />
            <p>{c.name}</p>
            {chain?.id === c.id && (
              <>
                <div className="h-[6px] w-[6px] rounded-full bg-[#66E070] ml-7" />
                <p className="text-[8px] font-medium ml-1">Connected</p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  ) : (
    <></>
  )
};

export default ConnectWallet;
