import React, { useEffect, useState } from "react";
import airdrop from "@/assets/airdrop.svg";
import { AnimatePresence, motion } from "framer-motion";
import cross from "@/assets/cross.svg";

const Airdrop = () => {
  const [isOpen, onToggle] = useState(false);
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        onToggle(false);
      }
    });
  }, [onToggle]);
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
            id="modal-bg"
          >
            <motion.div
              initial={{ opacity: 0, top: "-100%" }}
              animate={{ opacity: 1, top: "50%" }}
              exit={{ opacity: 0, top: "-100%" }}
              transition={{
                duration: 0.3,
              }}
              className="bg-white w-[450px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute p-6 flex flex-col items-start overflow-y-auto z-50 md:hidden justify-center rounded-xl"
            >
              <div className="w-full flex justify-center relative">
                <span className="font-bold">Gas Fee Airdrop Rules</span>
                <img
                  src={cross.src}
                  alt="close"
                  className="cursor-pointer absolute ml-[100%]"
                  onClick={() => {
                    onToggle(false);
                  }}
                />
              </div>
              <div className="w-full mt-4">
                <ul className="list-disc ms-5 text-text-heading-gray text-sm font-medium">
                  <li className="mb-3">
                    {"New wallets (haven't received this airdrop before)"}
                  </li>
                  <li className="mb-3">
                    {"Do not have FUSE tokens on Fuse network balance"}
                  </li>
                  <li className="mb-3">
                    {"Eligible tokens: USDC, USDT, WETH, ETH"}
                  </li>
                  <li className="mb-3">
                    {"Min value amount $0 bridging into the Fuse Network"}
                  </li>
                  <li className="mb-3">
                    {
                      "0.01 Fuse Token will be airdropped to the wallet on Fuse Network"
                    }
                  </li>
                  <li>
                    {
                      "You can use the airdropped FUSE token as the gas fee to complete a few transactions on Fuse network"
                    }
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-black w-full rounded-lg px-6 py-7 flex text-white items-center">
        <img src={airdrop.src} alt="airdrop" />
        <div className="ps-4 flex flex-col">
          <span className="text-[20px] font-semibold">
            Airdrop of 0.01 FUSE
          </span>
          <span className="text-xs ps-[2px]">
            will be sent to every first time users!
          </span>
        </div>
        <div
          className="bg-fuse-green-light text-black ms-auto px-4 py-[10px] rounded-full cursor-pointer font-semibold text-xs"
          onClick={() => {
            onToggle(true);
          }}
        >
          Airdrop Rules
        </div>
      </div>
    </>
  );
};

export default Airdrop;
