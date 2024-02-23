import React from "react";
import historyPurple from "@/assets/historyPurple.svg";
import dismiss from "@/assets/dismiss.svg";
import right from "@/assets/right.svg";
import info from "@/assets/info.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectTransactionsSlice } from "@/store/transactionsSlice";
import { MessageStatus } from "@layerzerolabs/scan-client";
import {
  getEstimatedTransactionTime,
  getNetworkByChainKey,
  getScanLink,
} from "@layerzerolabs/ui-core";
import { getChainKey } from "@layerzerolabs/lz-sdk";
import Pill from "./Pill";
import { toggleLastTransactionToast } from "@/store/toastSlice";

const LastTransactionToast = () => {
  const transactionsSlice = useAppSelector(selectTransactionsSlice);
  const dispatch = useAppDispatch();
  return transactionsSlice.transactionHashes.length > 0 ? (
    <div className="w-full rounded-md border-[#8054FF66]/40 border-[1px] bg-[#EDEBFF] mt-4 p-4">
      <div className="flex">
        <img src={historyPurple.src} alt="history" className="h-6 w-[5%]" />
        <div className="flex flex-col w-[95%] ml-3">
          <div className="flex items-center justify-between">
            <p className="font-bold">Your last transaction</p>
            <img
              src={dismiss.src}
              alt="dismiss"
              className="h-5 cursor-pointer"
              onClick={() => {
                dispatch(toggleLastTransactionToast(false));
              }}
            />
          </div>
          <div
            className="flex text-sm text-secondary-gray mt-3 md:text-xs md:justify-between cursor-pointer"
            onClick={() => {
              window.open(
                getScanLink(
                  transactionsSlice.transactionHashes[0].srcChainId,
                  transactionsSlice.transactionHashes[0].hash
                ),
                "_blank"
              );
            }}
          >
            <div className="flex flex-col w-2/5">
              <p className="text-sm text-secondary-gray">From</p>
              <div className="flex font-medium mt-1 text-black">
                <span>
                  {
                    getNetworkByChainKey(
                      getChainKey(
                        transactionsSlice.transactionHashes[0].srcChainId
                      )
                    ).name
                  }
                </span>
                <img src={right.src} alt="right" className="ml-2" />
                <span className="ml-2">
                  {
                    getNetworkByChainKey(
                      getChainKey(
                        transactionsSlice.transactionHashes[0].dstChainId
                      )
                    ).name
                  }
                </span>
              </div>
            </div>
            <div className="flex flex-col w-1/5">
              <p>Amount</p>
              <p className="font-medium text-black mt-1">
                {transactionsSlice.transactionHashes[0].amount}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="mb-1">Status</p>
              <Pill
                text={
                  transactionsSlice.transactions[0] === MessageStatus.DELIVERED
                    ? "Complete"
                    : transactionsSlice.transactions[0] ===
                      MessageStatus.INFLIGHT
                    ? "Finishing"
                    : "Failed"
                }
                type={
                  transactionsSlice.transactions[0] === MessageStatus.DELIVERED
                    ? "success"
                    : transactionsSlice.transactions[0] ===
                      MessageStatus.INFLIGHT
                    ? "warning"
                    : "error"
                }
              />
            </div>
          </div>
          {transactionsSlice.transactions[0] === MessageStatus.INFLIGHT && (
            <div className="flex rounded-md px-3 py-[6px] bg-[#8054FF40] mt-3 items-center mr-auto">
              <img src={info.src} alt="info" className="h-3 mr-2" />
              <span className="text-xs flex md:text-[10px]">
                Expected transaction completion time:{" "}
                <p className="font-semibold ml-1">
                  {Math.ceil(
                    getEstimatedTransactionTime(
                      transactionsSlice.transactionHashes[0].srcChainId
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
