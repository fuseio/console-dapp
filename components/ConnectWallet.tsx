import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchValidators } from "@/store/validatorSlice";
import copy from "@/assets/copy-black.svg";
import Image, { StaticImageData } from "next/image";
import { motion, Variants } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import down from "@/assets/down-arrow.svg";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useConfig,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { eclipseAddress, evmDecimals, path, screenMediumWidth } from "@/lib/helpers";
import { arbitrum, polygon, fuse, optimism, bsc, mainnet, base } from "wagmi/chains";
import fuseIcon from "@/assets/fuse-icon.svg";
import polygonIcon from "@/assets/polygon-icon.svg";
import optimismIcon from "@/assets/optimism-icon.svg";
import arbitrumIcon from "@/assets/arbitrum-icon.svg";
import bscLogo from "@/assets/bnb-icon.svg";
import ethLogo from "@/assets/ethereum-icon.svg";
import baseIcon from "@/assets/base.svg";
import { useMediaQuery } from "usehooks-ts";
import qr from "@/assets/qr.svg";
import disconnectIcon from "@/assets/disconnect.svg";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import leftArrow from "@/assets/left-arrow.svg";
import QRCode from "react-qr-code";
import { setIsLogin, setIsOperatorWalletModalOpen } from "@/store/operatorSlice";
import { usePathname } from "next/navigation";
import switchNetworkIcon from "@/assets/switch-network.svg";
import Copy from "./ui/Copy";
import { formatUnits } from "viem";
import { resetConnection } from "@/lib/web3Auth";

const menu: Variants = {
  closed: (isCenter) => ({
    opacity: 0,
    transition: {
      delay: 0.15,
      duration: 0.3,
    },
    y: -50,
    x: isCenter ? "-50%" : 0,
    transitionEnd: {
      display: "none",
    },
  }),
  open: (isCenter) => ({
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      duration: 0.5,
    },
    y: 0,
    x: isCenter ? "-50%" : 0,
  }),
};

type Icons = {
  [key: string]: string | StaticImageData;
};

const icons: Icons = {
  [fuse.id]: fuseIcon,
  [polygon.id]: polygonIcon,
  [optimism.id]: optimismIcon,
  [arbitrum.id]: arbitrumIcon,
  [mainnet.id]: ethLogo,
  [bsc.id]: bscLogo,
  [base.id]: baseIcon,
};

type UsdTokens = {
  [key: string]: string;
};

const usdTokens: UsdTokens = {
  [fuse.id]: "fuse-network-token",
  [polygon.id]: "pol-network",
  [optimism.id]: "optimism",
  [arbitrum.id]: "arbitrum",
  [mainnet.id]: "ethereum",
  [bsc.id]: "binancecoin",
  [base.id]: "base",
};

const ConnectWallet = ({
  className = "",
  defaultClassName = "bg-fuse-black text-white px-4 py-2 rounded-full font-medium md:text-sm ",
  containerClassName = "",
}: {
  className?: string;
  defaultClassName?: string;
  containerClassName?: string;
}) => {
  const dispatch = useAppDispatch();
  const [isChainOpen, setIsChainOpen] = React.useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = React.useState(false);
  const [isWrongNetworksOpen, setIsWrongNetworksOpen] = React.useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = React.useState(false);
  const { address, connector, isConnected, chain } = useAccount();
  const { chains } = useConfig();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess() {
        resetConnection();
      }
    }
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address,
  });
  const matches = useMediaQuery(`(min-width: ${screenMediumWidth}px)`);
  const controller = useMemo(() => new AbortController(), []);
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const pathname = usePathname();

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
    if (isWrongNetworksOpen) {
      setIsWrongNetworksOpen(false);
    }
  });

  const checkCorrectNetwork = () => {
    const network = chains.find((c) => c.id === chain?.id);
    if (!network) return false;
    return true;
  };

  useEffect(() => {
    dispatch(fetchValidators());
  }, [connector, chain, dispatch]);

  useEffect(() => {
    dispatch(
      fetchUsdPrice({
        tokenId: usdTokens[chain?.id ?? fuse.id],
        controller,
      })
    );

    return () => {
      controller.abort();
    };
  }, [isConnected, chain, dispatch, controller]);

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch])

  return !isConnected ? (
    <div className={"flex justify-end " + containerClassName}>
      <button
        className={defaultClassName + className}
        onClick={() => {
          if (pathname === path.BUILD) {
            dispatch(setIsOperatorWalletModalOpen(true));
            dispatch(setIsLogin(true));
          }
          dispatch(setIsWalletModalOpen(true))
        }}
      >
        Connect Wallet
      </button>
    </div>
  ) : checkCorrectNetwork() && isChainOpen ? (
    <div
      className="flex relative justify-end md:me-5 text-base/4 md:text-sm h-9 md:h-7"
      ref={chainRef}
    >
      <div
        className="flex bg-lightest-gray px-4 py-3 md:py-3.5 rounded-full cursor-pointer items-center relative text-base/4 md:text-sm font-normal ml-2 md:ml-1"
        onClick={() => setIsChainOpen(!isChainOpen)}
      >
        <Image
          src={icons[chain?.id ?? 0]}
          alt={chain?.name ?? "Fuse"}
          width={matches ? 25 : 18}
          height={matches ? 25 : 18}
        />
        <p className="ms-[8.52px]">
          {eclipseAddress(String(address))}
        </p>
        <Image
          src={down}
          alt="down"
          className={`ms-[15px] ${isChainOpen && "rotate-180"} md:ms-1`}
          width={10}
          height={10}
        />
      </div>
      <motion.div
        animate={isChainOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className="absolute top-[120%] bg-white rounded-[20px] shadow-xl z-50 font-medium w-[268.22px] py-6"
      >
        <div className="flex flex-col gap-3.5 px-[22px]">
          <p className="font-bold">Switch Network</p>
        </div>
        <hr className="border-border-dark-gray mt-[13.57px] mb-[19.51px]" />
        <div className="flex flex-col gap-5 px-[22px]">
          {chains.map((c) => (
            <div
              className={
                "flex items-center " +
                (chain?.id === c.id
                  ? "cursor-auto"
                  : "cursor-pointer hover:opacity-70")
              }
              onClick={() => {
                switchChain({ chainId: c.id });
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
        <hr className="border-border-dark-gray mt-[19.99px] mb-[18.53px]" />
        <div
          className="flex items-center gap-[17.7px] cursor-pointer px-[22px]"
          onClick={() => disconnect()}
        >
          <Image
            src={disconnectIcon}
            alt="disconnect wallet"
            width={17.68}
            height={20}
          />
          <p>Disconnect</p>
        </div>
      </motion.div>
    </div>
  ) : checkCorrectNetwork() ? (
    <div className="flex justify-end md:justify-center md:me-5 relative w-[410px] md:w-fit h-9 md:h-7">
      <div
        className="flex bg-lightest-gray px-4 py-3 md:py-3.5 rounded-full cursor-pointer items-center relative text-base/4 md:text-sm font-normal ml-2 md:ml-1"
        ref={accountsRef}
      >
        <div
          className="flex w-full justify-between items-center"
          onClick={() => setIsAccountsOpen(!isAccountsOpen)}
        >
          <Image
            src={icons[chain?.id ?? 0]}
            alt={chain?.name ?? "Fuse"}
            width={matches ? 25 : 18}
            height={matches ? 25 : 18}
          />
          <p className="ms-[8.52px]">
            {eclipseAddress(String(address))}
          </p>
          <Image
            src={down}
            alt="down"
            className={`ms-[15px] ${isAccountsOpen && "rotate-180"} md:ms-1`}
            width={10}
            height={10}
          />
        </div>
        <motion.div
          animate={isQrCodeOpen ? "closed" : isAccountsOpen ? "open" : "closed"}
          custom={!matches && pathname === "/dashboard"}
          initial="closed"
          exit="closed"
          variants={menu}
          className={`absolute top-[120%] right-0 bg-white rounded-[20px] cursor-auto shadow-xl py-[25.5px] z-50 w-[268.22px] ${pathname === "/dashboard" ? "md:left-1/2" : ""}`}
        >
          <div className="flex flex-col gap-[8.35px] px-[22px]">
            <p className="text-xs/[11.6px] md:text-[8px] text-text-dark-gray font-medium">
              Connected account
            </p>
            <div className="flex justify-between">
              <p className="font-bold">{eclipseAddress(String(address))}</p>
              <div className="flex gap-[19.02px]">
                <Copy
                  src={copy}
                  text={String(address)}
                  width={18.97}
                  height={18.81}
                />
                <Image
                  src={qr}
                  alt="open qr code of address"
                  width={16.22}
                  height={16.65}
                  className="cursor-pointer"
                  onClick={() => setIsQrCodeOpen(!isQrCodeOpen)}
                />
              </div>
            </div>
          </div>
          <hr className="border-border-dark-gray mt-[25.62px] mb-[18.5px]" />
          <div className="flex flex-col gap-[8.35px] pl-[22.2px] pr-[17.42px] font-medium">
            <p className="text-xs/[11.6px] md:text-[8px] text-text-dark-gray">
              Wallet
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={icons[chain?.id ?? 0]}
                  alt={chain?.name ?? "Fuse"}
                  width={40}
                  height={40}
                  className="border border-[0.5px] border-gray-alpha-40 rounded-full"
                />
                <div className="flex flex-col justify-between gap-[3.68px]">
                  <p>{chain?.name} Token</p>
                  <p className="text-xs text-text-dark-gray">
                    {balance?.symbol}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-[3.68px] h-10">
                <p>{parseFloat(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) || "0").toFixed(4)}</p>
                {balanceSlice.isUsdPriceLoading ? (
                  <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span>
                ) : (
                  <p className="text-xs text-text-dark-gray">
                    $
                    {chain && chain.id === fuse.id
                      ? new Intl.NumberFormat().format(
                        parseFloat(
                          (
                            parseFloat(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0") *
                            balanceSlice.price
                          ).toString()
                        )
                      )
                      : 0}
                  </p>
                )}
              </div>
            </div>
          </div>
          <hr className="border-border-dark-gray mt-[22.6px] mb-[18.5px]" />
          <div
            className="flex items-center gap-[17.7px] cursor-pointer px-[22px]"
            onClick={() => {
              setIsAccountsOpen(!isAccountsOpen);
              setIsChainOpen(!isChainOpen);
            }}
          >
            <Image
              src={switchNetworkIcon}
              alt="switch network"
              width={12.16}
              height={19.8}
            />
            <p>Switch Network</p>
          </div>
          <hr className="border-border-dark-gray mt-[25.62px] mb-[18.5px]" />
          <div
            className="flex items-center gap-[17.7px] cursor-pointer px-[22px]"
            onClick={() => disconnect()}
          >
            <Image
              src={disconnectIcon}
              alt="disconnect wallet"
              width={17.68}
              height={20}
            />
            <p>Disconnect</p>
          </div>
        </motion.div>
        <motion.div
          animate={isAccountsOpen && isQrCodeOpen ? "open" : "closed"}
          initial="closed"
          exit="closed"
          variants={menu}
          className="absolute top-[120%] right-0 bg-white rounded-[20px] cursor-auto shadow-xl py-[25.5px] z-50 w-[268.22px]"
        >
          <div className="flex flex-col gap-6 px-[22px]">
            <button
              className="flex items-center gap-3 w-fit"
              onClick={() => setIsQrCodeOpen(!isQrCodeOpen)}
            >
              <Image
                src={leftArrow}
                alt="back arrow icon"
                width={11.39}
                height={5.7}
              />
              Back
            </button>
            <div className="flex justify-center">
              <QRCode
                size={150}
                value={String(address)}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : (
    <div
      className="flex relative justify-end md:me-5 text-base/4 md:text-sm"
      ref={wrongNetworkRef}
    >
      <div
        className="flex bg-[#FACBCB] px-[18.3px] py-3 md:py-1 md:px-2 rounded-full cursor-pointer items-center relative justify-center"
        onClick={() => setIsWrongNetworksOpen(!isWrongNetworksOpen)}
      >
        <p>Wrong Network</p>
        <Image
          src={down}
          alt="down"
          className={`ml-[15px] ${isWrongNetworksOpen && "rotate-180"}`}
          width={10}
          height={10}
        />
      </div>
      <motion.div
        animate={isWrongNetworksOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className="absolute top-[120%] bg-white rounded-[20px] shadow-xl z-50 font-medium w-[268.22px] py-6"
      >
        <div className="flex flex-col gap-3.5 px-[22px]">
          <p className="font-bold">Switch Network</p>
          <p className="text-xs/[11.6px] md:text-[8px] text-text-dark-gray">
            Wrong network detected, switch or disconnect to continue
          </p>
        </div>
        <hr className="border-border-dark-gray mt-[13.57px] mb-[19.51px]" />
        <div className="flex flex-col gap-5 px-[22px]">
          {chains.map((c) => (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                switchChain({ chainId: c.id });
              }}
              key={c.id}
            >
              <Image
                src={icons[c.id]}
                alt={c.name}
                className="h-8 md:h-7"
                width={32}
                height={32}
              />
              <p>{c.name}</p>
            </div>
          ))}
        </div>
        <hr className="border-border-dark-gray mt-[19.99px] mb-[18.53px]" />
        <div
          className="flex items-center gap-[17.7px] cursor-pointer px-[22px]"
          onClick={() => disconnect()}
        >
          <Image
            src={disconnectIcon}
            alt="disconnect wallet"
            width={17.68}
            height={20}
          />
          <p>Disconnect</p>
        </div>
      </motion.div>
    </div>
  )
};

export default ConnectWallet;
