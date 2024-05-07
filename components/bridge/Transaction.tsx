import React from "react";
import right from "@/assets/right.svg";
import info from "@/assets/info.svg";
import { MessageStatus } from "@layerzerolabs/scan-client";
import {
  getEstimatedTransactionTime,
  getNetworkByChainKey,
  getScanLink,
} from "@layerzerolabs/ui-core";
import { getChainKey } from "@layerzerolabs/lz-sdk";
import { TransactionType } from "@/store/transactionsSlice";
import Pill from "./Pill";
import Image from "next/image";

const Transaction = ({
  transaction,
  transactionHashes,
}: {
  transaction: MessageStatus;
  transactionHashes: TransactionType;
}) => {
  return (
    <div
      className="flex flex-col justify-between px-10 md:px-4 py-5 md:py-3 bg-transaction-bg w-full rounded-md mt-3 border-border-gray border-solid border font-medium cursor-pointer text-sm min-h-16 items-center"
      onClick={() => {
        window.open(
          getScanLink(transactionHashes.srcChainId, transactionHashes.hash),
          "_blank"
        );
      }}
    >
      <div className="grid-cols-12 grid md:grid-cols-6 w-full justify-between gap-y-4">
        <div className="flex col-span-4 justify-between md:col-span-4">
          <span>
            {
              getNetworkByChainKey(getChainKey(transactionHashes.srcChainId))
                .name
            }
          </span>
          <Image src={right} alt="right" className="h-3 mt-[3px]" />
          <span>
            {
              getNetworkByChainKey(getChainKey(transactionHashes.dstChainId))
                .name
            }
          </span>
        </div>
        <span className="col-span-3 md:col-span-2 md:text-right text-center">
          {parseFloat(transactionHashes.amount).toFixed(5)}
        </span>
        <span className="col-span-3 md:text-left md:col-span-4 text-center">
          {new Date(transactionHashes.timestamp).toLocaleDateString()}
        </span>
        <span className="col-span-2 justify-end ml-auto -mt-[3px]">
          <Pill
            text={
              transaction === MessageStatus.DELIVERED
                ? "Complete"
                : transaction === MessageStatus.INFLIGHT
                ? "Finishing"
                : "Failed"
            }
            type={
              transaction === MessageStatus.DELIVERED
                ? "success"
                : transaction === MessageStatus.INFLIGHT
                ? "warning"
                : "error"
            }
            className="mr-auto"
          />
        </span>
      </div>
      {transaction === MessageStatus.INFLIGHT && (
        <div className="flex rounded-md px-3 md:px-2 py-[6px] bg-[#E9E9E9] mt-3 items-center mr-auto md:text-[10px]">
          <Image src={info} alt="info" className="h-3 mr-2 md:mr-1" />
          <span className="text-xs flex">
            Expected transaction completion time:{" "}
            <p className="font-semibold ml-1">
              {Math.ceil(
                getEstimatedTransactionTime(transactionHashes.srcChainId) / 60
              ) + " min"}
            </p>
          </span>
        </div>
      )}
    </div>
  );
};

export default Transaction;
