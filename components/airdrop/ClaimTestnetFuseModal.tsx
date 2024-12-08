import React, { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { claimTestnetFuse, generateAirdropTwitterAuthUrl, selectAirdropSlice, setIsClaimTestnetFuseModalOpen } from "@/store/airdropSlice";
import Copy from "../ui/Copy";
import Spinner from "../ui/Spinner";
import { eclipseAddress, isTwitterFollowed } from "@/lib/helpers";

import close from "@/assets/close.svg";
import twitter from "@/assets/twitter-x-logo.svg";
import copy from "@/assets/copy.svg";
import checkmark from "@/assets/checkmark.svg";

const ClaimTestnetFuseModal = (): JSX.Element => {
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "claim-testnet-fuse-modal-bg") {
        dispatch(setIsClaimTestnetFuseModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {airdropSlice.isClaimTestnetFuseModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="claim-testnet-fuse-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-modal-bg min-h-[545px] w-[586px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="flex flex-col gap-10 px-10 py-12">
              <div className="flex justify-between items-start">
                <p className="text-[2.125rem] leading-none font-semibold">
                  Get FUSE on testnet
                </p>
                <Image
                  src={close}
                  alt="close"
                  width={40}
                  height={40}
                  className="cursor-pointer relative -top-4"
                  onClick={() => dispatch(setIsClaimTestnetFuseModalOpen(false))}
                />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <p className="text-[1.25rem] leading-none text-text-dark-gray font-medium">
                  Follow us on twitter
                </p>
                {isTwitterFollowed(airdropSlice.user) ? (
                  <div className="w-full transition ease-in-out flex justify-center items-center gap-2 bg-lightest-gray border-2 border-lightest-gray rounded-full px-2 py-4 text-lg leading-none font-bold">
                    <Image
                      src={checkmark}
                      alt="checkmark"
                      width={24}
                      height={24}
                    />
                    Followed
                  </div>
                ) : (
                  <button
                    className="w-full transition ease-in-out flex justify-center items-center gap-2 bg-lightest-gray border-2 border-lightest-gray rounded-full px-2 py-4 text-lg leading-none font-bold hover:bg-[transparent]"
                    onClick={() => {
                      localStorage.setItem("airdrop-isClaimTestnetFuse", "true");
                      dispatch(generateAirdropTwitterAuthUrl())
                    }}
                  >
                    <Image
                      src={twitter}
                      alt="twitter"
                      width={24}
                      height={24}
                    />
                    Follow @Fuse_network
                    {airdropSlice.isGeneratingTwitterAuthUrl && (
                      <Spinner />
                    )}
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[1.25rem] leading-none text-text-dark-gray font-medium">
                  Your wallet address
                </p>
                <button className="w-full flex justify-between items-center gap-2 bg-white rounded-full px-6 py-6 leading-none font-medium">
                  <span className="md:hidden">
                    {airdropSlice.user.walletAddress}
                  </span>
                  <span className="hidden md:block">
                    {eclipseAddress(airdropSlice.user.walletAddress)}
                  </span>
                  <Copy
                    src={copy}
                    text={airdropSlice.user.walletAddress}
                  />
                </button>
              </div>
              <button
                className="w-full transition ease-in-out flex justify-center items-center gap-2 bg-fuse-black enabled:border-2 enabled:border-fuse-black rounded-full px-2 py-4 text-lg leading-none enabled:text-white font-bold enabled:hover:bg-[transparent] enabled:hover:text-black disabled:bg-lightest-gray"
                disabled={!isTwitterFollowed(airdropSlice.user)}
                onClick={() => dispatch(claimTestnetFuse())}
              >
                Get 1 FUSE token on Flash Testnet
                {(airdropSlice.isClaimingTestnetFuse || airdropSlice.isVerifyingQuest) && (
                  <Spinner />
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ClaimTestnetFuseModal;
