import React, { useEffect, useState } from "react";
import airdrop from "@/assets/airdrop.svg";
import { AnimatePresence, motion } from "framer-motion";
import cross from "@/assets/cross.svg";
import copy from "@/assets/copy.svg";
import { selectToastSlice, toggleAddTokenToast } from "@/store/toastSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { appConfig } from "@/lib/config";
import tick from "@/public/tick.png";
import Image from "next/image";
import Copy from "../ui/Copy";

const AddToken = () => {
  const tokenSlice = useAppSelector(selectToastSlice);
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        dispatch(toggleAddTokenToast(false));
      }
    });
  }, []);
  useEffect(() => {
    setChecked(false);
  }, [tokenSlice.token]);
  const getTokenAddress = (token: string) => {
    const tokenDetails = appConfig.wrappedBridge.fuse.tokens.find(
      (t) => t.symbol === token
    );
    return tokenDetails?.address;
  };
  const getTokenDecimals = (token: string) => {
    const tokenDetails = appConfig.wrappedBridge.fuse.tokens.find(
      (t) => t.symbol === token
    );
    return tokenDetails?.decimals;
  };
  const getTokenIcon = (token: string) => {
    const tokenDetails = appConfig.wrappedBridge.fuse.tokens.find(
      (t) => t.symbol === token
    );
    return tokenDetails?.icon;
  };

  return (
    <>
      <AnimatePresence>
        {tokenSlice.isAddTokenToastOpen && (
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
              className="bg-white w-[548px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute px-[60px] py-[50px] flex flex-col items-start overflow-y-auto z-50 md:hidden justify-center rounded-[20px]"
            >
              <div className="w-full">
                <img
                  src={cross.src}
                  alt="close"
                  className="cursor-pointer h-7 ml-auto translate-x-[150%] translate-y-[-100%]"
                  onClick={() => {
                    dispatch(toggleAddTokenToast(false));
                  }}
                />
              </div>
              <span className="text-3xl font-bold -mt-7">
                Add token to wallet
              </span>
              <span className="text-sm font-normal text-[#4d4d4d] mt-3">
                After completing a transaction, on the Fuse network you will
                receive a version of the token minted specifically for Fuse
                Bridge. You can add it to your wallet manually using the
                contract address, or simply click Add token button below.
              </span>
              <div className="px-10 py-5 rounded-[14px] border-[1px] w-full border-[#D2D5D8] mt-6 flex items-center justify-between">
                <img
                  src={getTokenIcon(tokenSlice.token as string)}
                  alt="token"
                  className="w-[10%]"
                />
                <span className="text-sm font-semibold ml-2 w-[20%]">
                  {tokenSlice.token}
                </span>
                <span className="text-base text-[#666] w-[60%] break-all">
                  {getTokenAddress(tokenSlice.token as string)}
                </span>
                <div className="w-[10%] flex justify-center">
                  <Copy
                    src={copy}
                    text={getTokenAddress(tokenSlice.token as string) as string}
                    alt="copy token address"
                  />
                </div>
              </div>
              <div className="w-full flex justify-center mt-24">
                <button
                  className="bg-success rounded-full py-4 text-base font-bold w-full"
                  onClick={() => {
                    // @ts-ignore
                    window.ethereum.request({
                      method: "wallet_watchAsset",
                      params: {
                        type: "ERC20",
                        options: {
                          address: getTokenAddress(tokenSlice.token as string),
                          symbol: tokenSlice.token,
                          decimals: getTokenDecimals(
                            tokenSlice.token as string
                          ),
                          chainId: 122,
                        },
                      },
                    });
                  }}
                >
                  Add token
                </button>
              </div>
              <div className="w-full flex justify-center mt-6 items-center">
                <div
                  className="h-[18px] w-[18px] rounded cursor-pointe outline outline-[1.5px] outline-black p-[2px]"
                  onClick={() => {
                    const tokensAdded = localStorage.getItem("tokensAdded");
                    if (checked) {
                      let tokens = JSON.parse(tokensAdded as string);
                      tokens.pop();
                      localStorage.setItem(
                        "tokensAdded",
                        JSON.stringify(tokens)
                      );
                    } else {
                      if (tokensAdded) {
                        const tokens = JSON.parse(tokensAdded);
                        tokens.push(tokenSlice.token);
                        localStorage.setItem(
                          "tokensAdded",
                          JSON.stringify(tokens)
                        );
                      } else {
                        localStorage.setItem(
                          "tokensAdded",
                          JSON.stringify([tokenSlice.token])
                        );
                      }
                    }
                    setChecked(!checked);
                  }}
                >
                  {checked && (
                    <img src={tick.src} alt="tick" className="h-full w-full" />
                  )}
                </div>
                <span className="text-sm ml-2">
                  {"Don't show this message again"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToken;
