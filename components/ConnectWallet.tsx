import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchValidators } from "@/store/validatorSlice";
import copy from "@/assets/copy-black.svg";
import exit from "@/assets/sign-out.svg";
import Image, { StaticImageData } from "next/image";
import { motion, Variants } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import down from "@/assets/down-arrow.svg";
import downWhite from "@/assets/down-white.svg";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { eclipseAddress } from "@/lib/helpers";
import { arbitrum, polygon, fuse, optimism } from "wagmi/chains";
import fuseIcon from "@/assets/fuse-icon.svg";
import polygonIcon from "@/assets/polygon-icon.svg";
import optimismIcon from "@/assets/optimism-icon.svg";
import arbitrumIcon from "@/assets/arbitrum-icon.svg";
import { useMediaQuery } from "usehooks-ts";
import qr from "@/assets/qr.svg";
import disconnectIcon from "@/assets/disconnect.svg";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";

const screenMediumWidth = 768;
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

type Icons = {
  [key: string]: string | StaticImageData;
};

const icons: Icons = {
  [fuse.id]: fuseIcon,
  [polygon.id]: polygonIcon,
  [optimism.id]: optimismIcon,
  [arbitrum.id]: arbitrumIcon,
};

type UsdTokens = {
  [key: string]: string;
};

const usdTokens: UsdTokens = {
  [fuse.id]: "fuse-network-token",
  [polygon.id]: "matic-network",
  [optimism.id]: "optimism",
  [arbitrum.id]: "arbitrum",
}

const ConnectWallet = ({
  disableAccountCenter = false,
  className = "",
  containerClassName = "",
}: {
  disableAccountCenter?: boolean;
  className?: string;
  containerClassName?: string;
}) => {
  const dispatch = useAppDispatch();
  const [isChainOpen, setIsChainOpen] = React.useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = React.useState(false);
  const [isWrongNetwoksOpen, setIsWrongNetwoksOpen] = React.useState(false);
  const { address, connector, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const balance = useBalance({
    address,
    watch: true,
  });
  const matches = useMediaQuery(`(min-width: ${screenMediumWidth}px)`);
  const controller = new AbortController();
  const balanceSlice = useAppSelector(selectBalanceSlice);

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
  const wrongNetworkRef = useOutsideClick(() => {
    if (isWrongNetwoksOpen) {
      setIsWrongNetwoksOpen(false);
    }
  });

  const checkCorrectNetwork = () => {
    const network = chains.find((c) => c.id === chain?.id);
    if (!network) return false;
    return true;
  };

  useEffect(() => {
    dispatch(fetchValidators());
  }, [connector, chain]);

  useEffect(() => {
    dispatch(fetchUsdPrice({
      tokenId: usdTokens[chain?.id ?? fuse.id],
      controller
    }))

    return () => {
      controller.abort();
    }
  }, [isConnected, chain])

  return !isConnected ? (
    <div className={"flex justify-end " + containerClassName}>
      <button
        className={
          "bg-fuse-black text-white px-4 py-2 rounded-full font-medium md:text-sm " +
          className
        }
        onClick={() => dispatch(setIsWalletModalOpen(true))}
      >
        Connect Wallet
      </button>
    </div>
  ) : !disableAccountCenter && checkCorrectNetwork() ? (
    <div className="flex justify-end md:justify-center relative w-[410px] md:w-[90%] h-9 md:h-7">
      <div
        className="flex bg-lightest-gray px-[14.8px] py-[7px] md:py-3.5 rounded-full cursor-pointer items-center relative text-base/4 md:text-[8px] font-bold whitespace-nowrap justify-center"
        ref={chainRef}
        onClick={() => setIsChainOpen(!isChainOpen)}
      >
        <div className="flex w-full justify-center items-center">
          <Image
            src={icons[chain?.id ?? 0]}
            alt="Fuse"
            className="border-[0.5px] border-gray-alpha-40 rounded-full me-2 md:me-[2px]"
            width={matches ? 25 : 17}
            height={matches ? 25 : 17}
          />
          <p>{chain?.name}</p>
          <Image
            src={down.src}
            alt="down"
            className={`ms-2 md:ms-[2px] ${isChainOpen && "rotate-180"}`}
            width={11.39}
            height={5.7}
          />
        </div>
        <motion.div
          animate={isChainOpen ? "open" : "closed"}
          initial="closed"
          exit="closed"
          variants={menu}
          className="absolute top-[120%] left-0 bg-white rounded-[20px] shadow-xl px-[22px] py-8 z-50 md:text-[8px] font-medium min-w-[268.22px]"
        >
          <div className="flex flex-col gap-5">
            {chains.map((c) => (
              <div
                className={"flex items-center " + (chain?.id === c.id ? "cursor-auto" : "cursor-pointer hover:opacity-70")}
                onClick={() => {
                  switchNetwork && switchNetwork(c.id);
                }}
                key={c.id}
              >
                <Image
                  src={icons[c.id]}
                  alt={c.name}
                  className="h-8 me-2 md:h-7"
                  width={32}
                  height={32}
                />
                <p>{c.name}</p>
                {chain?.id === c.id && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#66E070] ml-auto" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div
        className="flex bg-lightest-gray px-[20.3px] py-3 md:py-3.5 rounded-full cursor-pointer items-center relative text-base/4 md:text-[8px]/[25px] font-normal ml-2 md:ml-1"
        ref={accountsRef}
        onClick={() => setIsAccountsOpen(!isAccountsOpen)}
      >
        <div className="flex w-full justify-between">
          <p>
            {eclipseAddress(String(address))}
          </p>
          <Image
            src={down.src}
            alt="down"
            className={`ms-2 mr-2 ${isAccountsOpen && "rotate-180"} md:ms-1`}
            width={10}
            height={10}
          />
        </div>
        <motion.div
          animate={isAccountsOpen ? "open" : "closed"}
          initial="closed"
          exit="closed"
          variants={menu}
          className="absolute top-[120%] right-0 bg-white rounded-[20px] cursor-auto shadow-xl py-[25.5px] z-50 w-[268.22px]"
        >
          <div className="flex flex-col gap-[8.35px] px-[22px]">
            <p className="text-xs/[11.6px] md:text-[8px] text-text-dark-gray font-medium">
              Connected account
            </p>
            <div className="flex justify-between">
              <p className="font-bold">
                {eclipseAddress(String(address))}
              </p>
              <div className="flex gap-[19.02px]">
                <Image
                  src={copy.src}
                  alt="copy address"
                  width={18.97}
                  height={18.81}
                  className="cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(String(address))}
                />
                {/* <Image
                  src={qr.src}
                  alt="copy address"
                  width={16.22}
                  height={16.65}
                /> */}
              </div>
            </div>
          </div>
          <hr className="border-border-dark-gray mt-[25.62px] mb-[18.5px]" />
          <div className="flex flex-col gap-[8.35px] px-[22px]">
            <p className="text-xs/[11.6px] md:text-[8px] text-text-dark-gray font-medium">
              Wallet
            </p>
            <div className="flex justify-between">
              <div className="flex gap-3">
                <Image
                  src={icons[chain?.id ?? 0]}
                  alt={chain?.name ?? "Fuse"}
                  width={32}
                  height={32}
                />
                <div className="flex flex-col justify-between gap-[3.68px]">
                  <p>{chain?.name} Token</p>
                  <p className="text-xs text-text-dark-gray">{balance.data?.symbol}</p>
                </div>
              </div>
              <div className="flex flex-col gap-[3.68px]">
                <p>{parseFloat(balance.data?.formatted || "0").toFixed(4)}</p>
                {balanceSlice.isUsdPriceLoading ?
                  <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
                  <p className="text-xl text-darker-gray">
                    ${(chain && chain.id === fuse.id) ?
                      new Intl.NumberFormat().format(
                        parseFloat((parseFloat(balance.data?.formatted ?? "0") * balanceSlice.price).toString())
                      ) :
                      0
                    }
                  </p>
                }
              </div>
            </div>
          </div>
          <hr className="border-border-dark-gray mt-[25.62px] mb-[18.5px]" />
          <div
            className="flex items-center gap-[17.7px] cursor-pointer px-[22px]"
            onClick={() => disconnect()}
          >
            <Image
              src={disconnectIcon.src}
              alt="disconnect wallet"
              width={17.68}
              height={20}
            />
            <p>Disconnect</p>
          </div>
        </motion.div>
      </div>
    </div>
  ) : !disableAccountCenter ? (
    <div className="flex relative w-[410px] justify-end md:me-2">
      <div
        className="flex bg-[#FD0F0F] text-white px-[10px] py-[6px] md:py-1 md:px-2 rounded cursor-pointer items-center relative text-xs md:text-[8px] font-medium justify-center"
        ref={wrongNetworkRef}
        onClick={() => setIsWrongNetwoksOpen(!isWrongNetwoksOpen)}
      >
        <div className="flex w-full justify-center">
          <p className="text-xs/5 md:text-[8px]">Wrong Network</p>
          <Image
            src={downWhite.src}
            alt="down"
            className={`ml-2 ${isWrongNetwoksOpen && "rotate-180"}`}
            width={10}
            height={10}
          />
        </div>
      </div>
      <motion.div
        animate={isWrongNetwoksOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className="absolute top-[120%] bg-white rounded shadow-xl z-50 text-xs/5 md:text-[8px] font-medium w-[192px]"
      >
        <div className="flex px-[12px] pt-[12px] pb-[6px] flex-col w-full border-b-[1px] border-lighter-blue mb-[6px]">
          <p className="font-bold text-xs md:text-[8px]">Switch Network</p>
          <p className="text-xs/[15px] md:text-[8px] font-normal text-text-heading-gray mt-1">
            Wrong network detected, switch or disconnect to continue
          </p>
        </div>
        {chains.map((c) => (
          <div
            className="flex items-center px-[12px] cursor-pointer"
            onClick={() => {
              switchNetwork && switchNetwork(c.id);
            }}
            key={c.id}
          >
            <Image
              src={icons[c.id]}
              alt={c.name}
              className="h-8 me-2 md:h-7"
              width={15}
              height={15}
            />
            <p>{c.name}</p>
          </div>
        ))}
        <div
          className="bg-[#FD0F0F] text-white rounded px-[9px] py-[7px] flex mt-1 mx-[6px] mb-2 cursor-pointer"
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
  ) : (
    <></>
  );
};

export default ConnectWallet;
