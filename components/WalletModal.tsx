import React, { useEffect, useRef, useState } from "react";
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
import Image from "next/image";
import WalletButton from "./WalletButton";
import SocialButton from "./SocialButton";
import { useAccount, useConnect, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import ReactGA from "react-ga4";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNavbarSlice, setIsWalletModalOpen } from "@/store/navbarSlice";
import * as amplitude from "@amplitude/analytics-browser";
import { path, signDataMessage, walletType } from "@/lib/helpers";
import { fetchOperator, selectOperatorSlice, setHydrate, setIsContactDetailsModalOpen, setIsLoggedIn, setIsLogin, setIsLoginError, setIsOperatorWalletModalOpen, setIsValidated, setLogout, setRedirect, validateOperator } from "@/store/operatorSlice";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import { usePathname, useRouter } from "next/navigation";
import { fuse } from "viem/chains";

const WalletModal = (): JSX.Element => {
  const [selected, setSelected] = useState<"HOME" | "VOLT">("HOME");
  const [connectingWalletId, setConnectingWalletId] = useState<string>("");
  const { connect, connectors } = useConnect();
  const emailRef = useRef<HTMLInputElement>(null);
  const { isWalletModalOpen } = useAppSelector(selectNavbarSlice);
  const dispatch = useAppDispatch();
  const { address, connector, isConnected, isDisconnected } = useAccount();
  const signer = useEthersSigner();
  const router = useRouter();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isLogin, isValidated, isLoggedIn, isLoginError, isOperatorWalletModalOpen, redirect, signature } = useAppSelector(selectOperatorSlice);
  const pathname = usePathname();

  const { signMessage } = useSignMessage({
    message: signDataMessage,
    onMutate() {
      toggleModal(false);
    },
    onSuccess(data) {
      if (!address) {
        return;
      }
      dispatch(validateOperator({
        signData: {
          externallyOwnedAccountAddress: address,
          message: signDataMessage,
          signature: data
        },
      }));
    }
  })

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        toggleModal(false);
      }
    });
    dispatch(setHydrate());
  }, []);

  useEffect(() => {
    if (isConnected) {
      toggleModal(false);
    }
    
    if(address && connector) {
      const identifyEvent = new amplitude.Identify();
      identifyEvent.set('wallet_address', address);
      amplitude.identify(identifyEvent);

      amplitude.track("Wallet connected", {
        walletType: walletType[connector.id],
        walletAddress: address
      });
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected && isOperatorWalletModalOpen && chain && !signature) {
      if(chain.id !== fuse.id) {
        switchNetwork && switchNetwork(fuse.id)
      }
      signMessage();
    }
  }, [isConnected, isOperatorWalletModalOpen, chain, signature])

  useEffect(() => {
    if (isValidated && signer) {
      dispatch(setIsValidated(false));
      dispatch(fetchOperator({ signer }));
    }
  }, [isValidated, signer])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setIsLoggedIn(false));
      router.push("/dashboard")
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoginError) {
      if (redirect) {
        dispatch(setRedirect(""));
        router.push(redirect);
      } else {
        dispatch(setIsContactDetailsModalOpen(true));
      }
      dispatch(setIsLoginError(false));
    }
  }, [isLoginError, redirect])

  useEffect(() => {
    if (isDisconnected) {
      dispatch(setLogout());
    }
  }, [isDisconnected])

  const connectionEvent = (id: string) => {
    ReactGA.event({
      category: "Connection",
      action: "Connecting wallet",
      label: id,
    });
  };

  const connectWallet = (id: string) => {
    connectionEvent(id);
    setConnectingWalletId(id);
    connect({ connector: connectors.find((connector) => connector.id === id) });
    if(pathname === path.HOME) {
      router.push("/wallet");
    }
  }

  const toggleModal = (isModal: boolean) => {
    dispatch(setIsWalletModalOpen(isModal));
    dispatch(setIsOperatorWalletModalOpen(isModal));
    dispatch(setIsLogin(isModal));
  }

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
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
              className={`bg-white max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 items-center flex flex-col ${isOperatorWalletModalOpen ? "min-h-[625px] md:min-h-[400px] w-[548px] pt-[47.5px] px-[62px] pb-[60px] md:px-5 md:py-8 rounded-[20px]" : "min-h-[400px] w-[396px] p-5 rounded-lg"} `}
            >
              <span className="flex w-full justify-between items-start">
                {isOperatorWalletModalOpen ?
                  <p className="text-[34px]/[47.6px] font-bold">
                    Operator Account
                  </p> :
                  <p className="text-[20px] font-bold">
                    Connect Wallet
                  </p>
                }
                <Image
                  src={close}
                  alt="close"
                  className={`cursor-pointer w-6 ${isOperatorWalletModalOpen ? "absolute top-[15px] right-5" : ""}`}
                  onClick={() => {
                    toggleModal(false);
                  }}
                />
              </span>
              {isOperatorWalletModalOpen ?
                <span className="text-sm text-text-heading-gray pt-2 max-w-xs mr-auto">
                  {isLogin ?
                    "Select the option you used when creating your operator account." :
                    "Create new operator account, a smart wallet account will be created for you on the Fuse Network."
                  }
                </span> :
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
              }
              <div className={`grid grid-cols-3 w-full ${isOperatorWalletModalOpen ? "pt-[43.5px] gap-2.5" : "pt-4 gap-2"}`}>
                <WalletButton
                  icon={metamask}
                  text="MetaMask"
                  className="w-[35px]"
                  id="injected"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("injected")}
                />
                <WalletButton
                  icon={wc}
                  text="WalletConnect"
                  className="w-[35px]"
                  id="walletConnect"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("walletConnect")}
                />
                <WalletButton
                  icon={coinbase}
                  text="Coinbase"
                  className="h-[30px]"
                  id="coinbaseWallet"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("coinbaseWallet")}
                />
              </div>
              <div className={`flex w-full justify-between text-[#9F9F9F] items-center ${isOperatorWalletModalOpen ? "pt-6 text-sm md:text-[10px]" : "pt-4 text-[10px]"}`}>
                <hr className="w-[37%]" />
                <p>or connect with</p>
                <hr className="w-[37%]" />
              </div>
              <div className={`grid grid-cols-3 w-full ${isOperatorWalletModalOpen ? "pt-6 gap-x-2.5 gap-y-2" : "pt-4 gap-2"}`}>
                <SocialButton
                  icon={google}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#F3F3F3] h-10"}
                  id="google"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("google")}
                />
                <SocialButton
                  icon={fb}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#C2D7F2] h-10"}
                  id="facebook"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("facebook")}
                />
                <SocialButton
                  icon={twitter2}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#E5F5FF] h-10"}
                  id="twitter"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("twitter")}
                />
                <SocialButton
                  icon={discord2}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#D8DAF0] h-10"}
                  id="discord"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("discord")}
                />
                <SocialButton
                  icon={twitch}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#DBD8F0] h-10"}
                  id="twitch"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("twitch")}
                />
                <SocialButton
                  icon={gh}
                  className={isOperatorWalletModalOpen ? "bg-[#F3F3F3] h-[55px]" : "bg-[#F3F3F3] h-10"}
                  id="github"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("github")}
                />
              </div>
              <div className={`flex w-full justify-between text-[#9F9F9F] items-center ${isOperatorWalletModalOpen ? "pt-6 text-sm md:text-[10px]" : "pt-4 text-[10px]"}`}>
                <hr className="w-[40%]" />
                <p>or with email</p>
                <hr className="w-[40%]" />
              </div>
              <div className={`flex w-full ${isOperatorWalletModalOpen ? "pt-6" : "pt-3"}`}>
                <div className={`flex bg-[#F2F2F2] p-2 w-2/3 ${isOperatorWalletModalOpen ? "rounded-[40px] h-[45px]" : "rounded-md"}`}>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className={`outline-none w-full bg-[#F2F2F2] ${isOperatorWalletModalOpen ? "text-base leading-none font-medium px-[29.21px] py-[14.5px] placeholder:text-text-dark-gray" : "text-xs p-1"}`}
                    ref={emailRef}
                  />
                </div>
                <button
                  className={`bg-black w-1/3 ml-2 text-white ${isOperatorWalletModalOpen ? "rounded-[40px] text-base leading-none font-bold h-[45px]" : "rounded-md text-xs font-medium"}`}
                  onClick={() => {
                    if (!emailRef.current || !emailRef.current.value.length) {
                      return
                    }
                    localStorage.setItem("Fuse-loginHint", emailRef.current.value);
                    connectWallet("email");
                  }}
                >
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
                  onClick={() => {
                    toggleModal(false);
                  }}
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
