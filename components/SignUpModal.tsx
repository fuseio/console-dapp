import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import close from "@/assets/close.svg";
import fb from "@/assets/fb.svg";
import twitter2 from "@/assets/twitter2.svg";
import discord2 from "@/assets/discord2.svg";
import google from "@/assets/google.svg";
import twitch from "@/assets/twitch.svg";
import gh from "@/assets/gh.svg";
import Image from "next/image";
import SocialButton from "./SocialButton";
import { useAccount, useConnect } from "wagmi";
import ReactGA from "react-ga4";
import { useAppDispatch, useAppSelector } from "@/store/store";
import * as amplitude from "@amplitude/analytics-browser";
import { walletType } from "@/lib/helpers";
import { createSmartContractAccount, selectOperatorSlice, setIsLoginModalOpen, setIsSignUpModalOpen } from "@/store/operatorSlice";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";

const SignUpModal = (): JSX.Element => {
  const [connectingWalletId, setConnectingWalletId] = useState<string>("");
  const { connect, connectors } = useConnect();
  const { isSignUpModalOpen } = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const { address, connector, isConnected } = useAccount();
  const signer = useEthersSigner();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "sign-up-modal-bg") {
        dispatch(setIsSignUpModalOpen(false));
      }
    });
  }, []);

  useEffect(() => {
    if (address && connector) {
      amplitude.track("Wallet connected", {
        walletType: walletType[connector.id],
        walletAddress: address
      });
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected && signer && isSignUpModalOpen) {
      dispatch(setIsSignUpModalOpen(false));
      dispatch(createSmartContractAccount({ signer }));
    }
  }, [isConnected, signer, isSignUpModalOpen])

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
  }

  return (
    <AnimatePresence>
      {isSignUpModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="sign-up-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[203px] w-[396px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 flex flex-col"
          >
            <span className="flex w-full justify-between items-start">
              <p className="text-[20px] font-bold">Create your account</p>
              <Image
                src={close}
                alt="close"
                className="cursor-pointer w-6"
                onClick={() => dispatch(setIsSignUpModalOpen(false))}
              />
            </span>
            <span className="flex gap-1 text-sm pt-2">
              <p>
                Already have an account?
              </p>
              <div
                className="text-[#1877F2] underline cursor-pointer"
                onClick={() => {
                  dispatch(setIsSignUpModalOpen(false));
                  dispatch(setIsLoginModalOpen(true));
                }}
              >
                Login
              </div>
            </span>
            <div className="grid grid-cols-3 w-full gap-2 pt-4">
              <SocialButton
                icon={google}
                className="bg-[#F3F3F3]"
                id="google"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("google")}
              />
              <SocialButton
                icon={fb}
                className="bg-[#C2D7F2]"
                id="facebook"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("facebook")}
              />
              <SocialButton
                icon={twitter2}
                className="bg-[#E5F5FF]"
                id="twitter"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("twitter")}
              />
              <SocialButton
                icon={discord2}
                className="bg-[#D8DAF0]"
                id="discord"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("discord")}
              />
              <SocialButton
                icon={twitch}
                className="bg-[#DBD8F0]"
                id="twitch"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("twitch")}
              />
              <SocialButton
                icon={gh}
                className="bg-[#F3F3F3]"
                id="github"
                connectingWalletId={connectingWalletId}
                onClick={() => connectWallet("github")}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SignUpModal;
