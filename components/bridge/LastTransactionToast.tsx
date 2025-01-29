import React from "react";
import historyPurple from "@/assets/historyPurple.svg";
import dismiss from "@/assets/dismiss.svg";
import right from "@/assets/right.svg";
import info from "@/assets/info.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectTransactionsSlice } from "@/store/transactionsSlice";
import {
  getEstimatedTransactionTime,
  getScanLink,
} from "@layerzerolabs/ui-core";
import Pill from "./Pill";
import { toggleLastTransactionToast } from "@/store/toastSlice";
import Image from "next/image";
import { getChain } from "@/lib/helpers";

const LastTransactionToast = () => {
  const transactionsSlice = useAppSelector(selectTransactionsSlice);
  const lastTransaction = transactionsSlice.lastTransaction;
  const dispatch = useAppDispatch();
  return lastTransaction ? (
    <div className="w-full rounded-md border-[#8054FF66]/40 border-[1px] bg-[#EDEBFF] mt-4 p-4">
      <div className="flex">
        <Image src={historyPurple} alt="history" className="h-6 w-[5%]" />
        <div className="flex flex-col w-[95%] ml-3">
          <div className="flex items-center justify-between">
            <p className="font-bold">Your last transaction</p>
            <Image
              src={dismiss}
              alt="dismiss"
              className="h-5 cursor-pointer"
              onClick={() => {
                dispatch(toggleLastTransactionToast(false));
              }}
            />
          </div>
          <div
            className="flex sm:flex-col sm:gap-2 text-sm text-secondary-gray mt-3 md:text-xs md:justify-between cursor-pointer"
            onClick={() => {
              if (!lastTransaction.bridgeTransactionHash) return;
              window.open(
                getScanLink(
                  getChain(lastTransaction.srcChainId)?.lzChainId as number,
                  lastTransaction.bridgeTransactionHash
                ),
                "_blank"
              );
            }}
          >
            <div className="flex flex-col w-2/5 sm:w-full">
              <p className="text-sm text-secondary-gray">From</p>
              <div className="flex font-medium mt-1 text-black">
                <span>{getChain(lastTransaction.srcChainId)?.chainName}</span>
                <Image src={right} alt="right" className="ml-2" />
                <span className="ml-2">
                  {getChain(lastTransaction.dstChainId)?.chainName}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-1/5 sm:w-full">
              <p>Amount</p>
              <p className="font-medium text-black mt-1">
                {parseFloat(
                  parseFloat(lastTransaction.amount.split(" ")[0]).toFixed(5)
                ) < 0.00001
                  ? "< 0.00001"
                  : parseFloat(
                      parseFloat(lastTransaction.amount.split(" ")[0]).toFixed(
                        5
                      )
                    ) +
                    " " +
                    lastTransaction.amount.split(" ")[1]}
              </p>
            </div>
            <div className="flex flex-col sm:w-fit">
              <p className="mb-1">Status</p>
              <Pill
                text={
                  lastTransaction.status === "completed" &&
                  lastTransaction.bridgeStatus === "completed"
                    ? "Complete"
                    : lastTransaction.status === "completed" &&
                      (lastTransaction.bridgeStatus === "pending" ||
                        lastTransaction.bridgeStatus === "processing")
                    ? "Finishing"
                    : lastTransaction.status === "failed"
                    ? "Failed"
                    : "Pending"
                }
                type={
                  lastTransaction.status === "completed" &&
                  lastTransaction.bridgeStatus === "completed"
                    ? "success"
                    : "warning"
                }
              />
            </div>
          </div>
          {!(lastTransaction.bridgeStatus == "completed") && (
            <div className="flex rounded-md px-3 py-[6px] bg-[#8054FF40] mt-3 items-center mr-auto">
              <Image src={info} alt="info" className="h-3 mr-2" />
              <span className="text-xs flex md:text-[10px]">
                Expected transaction completion time:{" "}
                <p className="font-semibold ml-1">
                  {Math.ceil(
                    getEstimatedTransactionTime(
                      getChain(lastTransaction.dstChainId)?.lzChainId as number
                    ) / 60
                  ) + " min"}
                </p>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default LastTransactionToast;
