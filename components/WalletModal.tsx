import React, {FormEventHandler, useEffect, useRef, useState} from "react";
import metamask from "@/public/metamask.png";
import rabby from "@/public/rabby.jpg";
import wc from "@/assets/wc.svg";
import coinbase from "@/assets/coinbase.svg";
import google from "@/assets/google.svg";
import twitch from "@/assets/twitch.svg";
import gh from "@/assets/gh.svg";
import WalletButton from "./WalletButton";
import SocialButton from "./SocialButton";
import {useAccount} from "wagmi";
import {ProviderEnum} from "@dynamic-labs/types";
import ReactGA from "react-ga4";
import {useAppDispatch, useAppSelector} from "@/store/store";
import {selectNavbarSlice, setIsWalletModalOpen} from "@/store/navbarSlice";
import * as amplitude from "@amplitude/analytics-browser";
import {
  checkOperator,
  selectOperatorSlice,
  setHydrate,
  setIsLogin,
  setIsOperatorWalletModalOpen,
  setLogout,
} from "@/store/operatorSlice";
import {
  useConnectWithOtp,
  useSocialAccounts,
  useWalletOptions,
} from "@dynamic-labs/sdk-react-core";
import Modal from "./ui/Modal";
import {Dispatch} from "@reduxjs/toolkit";
import {
  authenticateAirdropUser,
  setHydrateAirdrop,
  setLogoutAirdrop,
} from "@/store/airdropSlice";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {path} from "@/lib/helpers";

type WalletModalProps = {
  isDisconnected: boolean;
  setIsDisconnected: (isDisconnected: boolean) => void;
};

type WalletProps = {
  className?: string;
};

export const Wallet = ({className}: WalletProps): JSX.Element => {
  const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [connectingWalletId, setConnectingWalletId] = useState<string>("");
  const emailRef = useRef<HTMLInputElement>(null);
  const {connectWithEmail, verifyOneTimePassword} = useConnectWithOtp();
  const [isProcessingEmail, setIsProcessingEmail] = useState(false);
  const dispatch = useAppDispatch();
  const {address} = useAccount();
  const {signInWithSocialAccount} = useSocialAccounts();
  const {selectWalletOption} = useWalletOptions();
  const {isLogin, isOperatorWalletModalOpen} =
    useAppSelector(selectOperatorSlice);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const onSubmitEmailHandler: FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    if (!emailRef.current?.value) return;

    try {
      await connectWithEmail(emailRef.current.value);
      setIsProcessingEmail(true);
      localStorage.setItem("Fuse-loginHint", emailRef.current.value);
    } catch (error) {
      console.error("Email connection failed:", error);
    }
  };

  const onSubmitOtpHandler: FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    const otp = event.currentTarget.otp.value;

    try {
      await verifyOneTimePassword(otp);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }

    const previousAddress = localStorage.getItem("Fuse-walletAddress");
    if (previousAddress && previousAddress !== address) {
      dispatch(setLogout());
      dispatch(setLogoutAirdrop());
    }

    localStorage.setItem("Fuse-walletAddress", address);
  }, [address, dispatch]);

  useEffect(() => {
    if (isConnectedWallet && address) {
      amplitude.setUserId(address);
      amplitude.track("Wallet connected", {
        walletType: localStorage.getItem("Fuse-selectedConnectorId"),
        walletAddress: address,
      });
      dispatch(authenticateAirdropUser({walletAddress: address, referralCode}));
    }
  }, [isConnectedWallet, address, dispatch, referralCode]);

  const connectionEvent = (id: string) => {
    ReactGA.event({
      category: "Connection",
      action: "Connecting wallet",
      label: id,
    });
  };

  const connectWallet = async (
    id: string | ProviderEnum,
    isSocial: boolean = false
  ) => {
    connectionEvent(id);
    setConnectingWalletId(id);

    if (isSocial) {
      await signInWithSocialAccount(id as ProviderEnum);
    } else {
      await selectWalletOption(id);
    }
    localStorage.setItem("Fuse-selectedConnectorId", id);
    localStorage.setItem("Fuse-connectedWalletType", id);
    setIsConnectedWallet(true);
  };

  return (
    <div className={className}>
      <span className="flex w-full justify-between items-start">
        {isOperatorWalletModalOpen ? (
          <p className="text-[34px]/[47.6px] font-bold">Operator Account</p>
        ) : (
          <p className="text-[20px] font-bold">Connect Wallet</p>
        )}
      </span>
      {isOperatorWalletModalOpen ? (
        <span className="text-sm text-text-heading-gray pt-2 max-w-xs mr-auto">
          {isLogin
            ? "Select the option you used when creating your operator account."
            : "Create new operator account, a smart wallet account will be created for you on the Fuse Network."}
        </span>
      ) : (
        <span className="text-sm pt-2">
          <p>
            Connecting your wallet is like &quot;logging in&quot; to Web3.
            Select your wallet from the options to get started.
          </p>
          <a
            href="https://news.fuse.io/what-is-a-web3-wallet"
            target="_blank"
            className="text-[#1877F2] underline"
          >
            What is Web3 wallet?
          </a>
        </span>
      )}
      <div className="grid grid-cols-3 w-full pt-[43.5px] gap-2.5">
        <WalletButton
          icon={metamask}
          text="MetaMask"
          className="w-[35px]"
          id="metamask"
          connectingWalletId={connectingWalletId}
          onClick={() => connectWallet("metamask")}
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
          onClick={() => connectWallet("coinbase")}
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
      <div className="flex w-full justify-between text-[#9F9F9F] items-center pt-6 text-sm md:text-[10px]">
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
      )}
    </div>
  );
};

const WalletModal = ({isDisconnected, setIsDisconnected}: WalletModalProps) => {
  const dispatch = useAppDispatch();
  const {isWalletModalOpen} = useAppSelector(selectNavbarSlice);
  const {isConnected, address} = useAccount();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      toggleModal(dispatch, false);
    }
  }, [isConnected, dispatch]);

  useEffect(() => {
    if (isDisconnected) {
      setIsDisconnected(false);
      dispatch(setLogout());
      dispatch(setLogoutAirdrop());

      const isProtectedRoute = pathname.startsWith(path.BUILD);
      if (!isProtectedRoute) return;

      router.replace(path.BUILD);
    }
  }, [dispatch, isDisconnected, pathname, router, setIsDisconnected]);

  useEffect(() => {
    dispatch(setHydrate());
    dispatch(setHydrateAirdrop());
  }, [dispatch]);

  const toggleModal = (dispatch: Dispatch, isOpen: boolean) => {
    dispatch(setIsWalletModalOpen(isOpen));
    dispatch(setIsOperatorWalletModalOpen(isOpen));
    dispatch(setIsLogin(isOpen));
  };

  useEffect(() => {
    if (address) {
      dispatch(checkOperator({address}));
    }
  }, [address, dispatch]);

  return (
    <Modal
      isOpen={isWalletModalOpen}
      toggleModal={() => toggleModal(dispatch, !isWalletModalOpen)}
      className="flex flex-col items-center bg-white rounded-[20px] min-h-[600px] md:min-h-[400px] w-[548px] max-w-[95%] pt-[47.5px] px-[62px] pb-[60px] md:px-5 md:py-8"
    >
      <Wallet />
    </Modal>
  );
};

export default WalletModal;
