import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import close from "@/assets/close.svg";
import metamask from "@/public/metamask.png";
import rabby from "@/public/rabby.jpg";
import wc from "@/assets/wc.svg";
import coinbase from "@/assets/coinbase.svg";
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
import { useAccount, useSignMessage, useSwitchChain } from "wagmi";
import { ProviderEnum } from '@dynamic-labs/types';
import ReactGA from "react-ga4";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNavbarSlice, setIsWalletModalOpen } from "@/store/navbarSlice";
import * as amplitude from "@amplitude/analytics-browser";
import { path, signDataMessage } from "@/lib/helpers";
import { checkIsActivated, checkOperator, fetchOperator, fetchSponsoredTransactions, selectOperatorSlice, setHydrate, setIsContactDetailsModalOpen, setIsLoggedIn, setIsLogin, setIsLoginError, setIsOperatorWalletModalOpen, setIsValidated, setLogout, setRedirect, validateOperator, withRefreshToken } from "@/store/operatorSlice";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import { usePathname, useRouter } from "next/navigation";
import { fuse } from "viem/chains";
import { useSocialAccounts, useWalletOptions } from "@dynamic-labs/sdk-react-core";

const WalletModal = (): JSX.Element => {
  const [selected, setSelected] = useState<"HOME" | "VOLT">("HOME");
  const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState<string>("");
  // const emailRef = useRef<HTMLInputElement>(null);
  // const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();
  // const { user } = useDynamicContext();
  // const [isProcessingEmail, setIsProcessingEmail] = useState(false);
  const { isWalletModalOpen } = useAppSelector(selectNavbarSlice);
  const dispatch = useAppDispatch();
  const { address, isConnected, isDisconnected, chain } = useAccount();
  const signer = useEthersSigner();
  const router = useRouter();
  const { switchChain } = useSwitchChain();
  const { signInWithSocialAccount } = useSocialAccounts();
  const { selectWalletOption } = useWalletOptions();
  const { isLogin, isValidated, isLoggedIn, isLoginError, isAuthenticated, isOperatorWalletModalOpen, redirect, operatorContactDetail } = useAppSelector(selectOperatorSlice);
  const pathname = usePathname();

  // const onSubmitEmailHandler: FormEventHandler<HTMLFormElement> = async (
  //   event,
  // ) => {
  //   event.preventDefault();
  //   if (!emailRef.current?.value) return;

  //   try {
  //     await connectWithEmail(emailRef.current.value);
  //     setIsProcessingEmail(true);
  //     localStorage.setItem("Fuse-loginHint", emailRef.current.value);
  //   } catch (error) {
  //     console.error('Email connection failed:', error);
  //   }
  // };

  // const onSubmitOtpHandler: FormEventHandler<HTMLFormElement> = async (
  //   event,
  // ) => {
  //   event.preventDefault();

  //   const otp = event.currentTarget.otp.value;

  //   try {
  //     await verifyOneTimePassword(otp);
  //   } catch (error) {
  //     console.error('OTP verification failed:', error);
  //   }
  // };

  const toggleModal = useCallback((isModal: boolean) => {
    dispatch(setIsWalletModalOpen(isModal));
    dispatch(setIsOperatorWalletModalOpen(isModal));
    dispatch(setIsLogin(isModal));
  }, [dispatch])

  const { signMessage } = useSignMessage({
    mutation: {
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
    }
  })

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        toggleModal(false);
      }
    });
    dispatch(setHydrate());
  }, [dispatch, toggleModal]);

  useEffect(() => {
    if (isConnected) {
      toggleModal(false);
    }
  }, [isConnected, toggleModal])

  useEffect(() => {
    if (!address) {
      return;
    }

    const previousAddress = localStorage.getItem("Fuse-walletAddress");
    if (previousAddress && previousAddress !== address) {
      dispatch(setLogout());
    }

    localStorage.setItem("Fuse-walletAddress", address);
  }, [address, dispatch])

  useEffect(() => {
    if (isConnectedWallet && address) {
      amplitude.setUserId(address);
      amplitude.track("Wallet connected", {
        walletType: localStorage.getItem("Fuse-selectedConnectorId"),
        walletAddress: address
      });
      dispatch(checkOperator({ address }));
    }
  }, [isConnectedWallet, address, dispatch])

  useEffect(() => {
    if (isConnected && isOperatorWalletModalOpen && chain && !isValidated) {
      if (chain.id !== fuse.id) {
        switchChain({ chainId: fuse.id })
      }
      signMessage({ message: signDataMessage });
    }
  }, [isConnected, isOperatorWalletModalOpen, chain, isValidated, signMessage, switchChain])

  useEffect(() => {
    if (isValidated) {
      dispatch(setIsValidated(false));
      dispatch(withRefreshToken(() => dispatch(fetchOperator())));
    }
  }, [dispatch, isValidated])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setIsLoggedIn(false));
      router.push("/dashboard")
    }
  }, [dispatch, isLoggedIn, router])

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
  }, [isLoginError, redirect, signer, operatorContactDetail, dispatch, router])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(withRefreshToken(() => dispatch(fetchSponsoredTransactions())));
      dispatch(withRefreshToken(() => dispatch(checkIsActivated())));
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (isDisconnected) {
      dispatch(setLogout());
    }
  }, [dispatch, isDisconnected])

  const connectionEvent = (id: string) => {
    ReactGA.event({
      category: "Connection",
      action: "Connecting wallet",
      label: id,
    });
  };

  const connectWallet = async (id: string | ProviderEnum, isSocial: boolean = false) => {
    connectionEvent(id);
    setConnectingWalletId(id);

    if (isSocial) {
      await signInWithSocialAccount(id as ProviderEnum);
    } else {
      await selectWalletOption(id);
    }
    localStorage.setItem("Fuse-selectedConnectorId", id);
    localStorage.setItem("Fuse-connectedWalletType", id);
    if (pathname === path.HOME) {
      router.push("/wallet");
    }
    setIsConnectedWallet(true);
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
              className="bg-white max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 items-center flex flex-col min-h-[600px] md:min-h-[400px] w-[548px] pt-[47.5px] px-[62px] pb-[60px] md:px-5 md:py-8 rounded-[20px]"
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
                  className="cursor-pointer w-6 absolute top-[15px] right-5"
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
              <div className="grid grid-cols-3 w-full pt-[43.5px] gap-2.5">
                <WalletButton
                  icon={metamask}
                  text="MetaMask"
                  className="w-[35px]"
                  id="metamask"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet('metamask')}
                />
                <WalletButton
                  icon={rabby}
                  text="Rabby"
                  className="w-[35px]"
                  id="rabby"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("rabby")}
                />
                <WalletButton
                  icon={wc}
                  text="WalletConnect"
                  className="w-[35px]"
                  id="walletConnect"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet("walletconnect")}
                />
                <WalletButton
                  icon={coinbase}
                  text="Coinbase"
                  className="h-[30px]"
                  id="coinbaseWallet"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet('coinbase')}
                />
              </div>
              <div className="flex w-full justify-between text-[#9F9F9F] items-center pt-6 text-sm md:text-[10px]">
                <hr className="w-[37%]" />
                <p>or connect with</p>
                <hr className="w-[37%]" />
              </div>
              <div className="grid grid-cols-3 w-full pt-6 gap-x-2.5 gap-y-2">
                <SocialButton
                  icon={google}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="google"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Google, true)}
                />
                <SocialButton
                  icon={fb}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="facebook"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Facebook, true)}
                />
                <SocialButton
                  icon={twitter2}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="twitter"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Twitter, true)}
                />
                <SocialButton
                  icon={discord2}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="discord"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Discord, true)}
                />
                <SocialButton
                  icon={twitch}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="twitch"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Twitch, true)}
                />
                <SocialButton
                  icon={gh}
                  className="bg-[#F3F3F3] h-[55px]"
                  id="github"
                  connectingWalletId={connectingWalletId}
                  onClick={() => connectWallet(ProviderEnum.Github, true)}
                />
              </div>
              {/* <div className="flex w-full justify-between text-[#9F9F9F] items-center pt-6 text-sm md:text-[10px]">
                <hr className="w-[40%]" />
                <p>or with email</p>
                <hr className="w-[40%]" />
              </div>
              <form onSubmit={onSubmitEmailHandler} className="flex w-full pt-6">
                <div className="flex bg-[#F2F2F2] p-2 w-2/3 rounded-[40px] h-[45px]">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="outline-none w-full bg-[#F2F2F2] text-base leading-none font-medium px-[29.21px] py-[14.5px] placeholder:text-text-dark-gray"
                    ref={emailRef}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black w-1/3 ml-2 text-white rounded-[40px] text-base leading-none font-bold h-[45px]"
                >
                  Send OTP
                </button>
              </form>
              {isProcessingEmail && (
                <form onSubmit={onSubmitOtpHandler} className="mt-4 w-full">
                  <div className="flex bg-[#F2F2F2] p-2 rounded-[40px] h-[45px]">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP code"
                      className="outline-none w-full bg-[#F2F2F2] text-base leading-none font-medium px-[29.21px] py-[14.5px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black w-full mt-2 text-white rounded-[40px] text-base leading-none font-bold h-[45px]"
                  >
                    Verify OTP
                  </button>
                </form>
              )} */}
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