import React from "react";
import right from "@/assets/right.svg";
import info from "@/assets/info.svg";
import {
  getEstimatedTransactionTime,
  getScanLink,
} from "@layerzerolabs/ui-core";
import { TransactionType } from "@/store/transactionsSlice";
import Pill from "./Pill";
import Image from "next/image";
import { getChain } from "@/lib/helpers";

const Transaction = ({ transaction }: { transaction: TransactionType }) => {
  return (
    <div
      className="flex flex-col justify-between px-10 md:px-4 py-5 md:py-3 bg-transaction-bg w-full rounded-md mt-3 border-border-gray border-solid border font-medium cursor-pointer text-sm min-h-16 items-center"
      onClick={() => {
        window.open(
          getScanLink(
            getChain(transaction.chainId)?.lzChainId as number,
            transaction.bridgeTransactionHash
          ),
          "_blank"
        );
      }}
    >
      <div className="grid-cols-12 grid md:grid-cols-6 w-full justify-between gap-y-4">
        <div className="flex col-span-4 justify-between md:col-span-4">
          <span>{getChain(transaction.chainId)?.chainName}</span>
          <Image src={right} alt="right" className="h-3 mt-[3px]" />
          <span>{getChain(transaction.destChainId)?.chainName}</span>
        </div>
        <span className="col-span-3 md:col-span-2 md:text-right text-center">
          {parseFloat(parseFloat(transaction.amount.toString()).toFixed(5)) <
          0.00001
            ? "< 0.00001"
            : parseFloat(parseFloat(transaction.amount.toString()).toFixed(5)) +
              " " +
              transaction.token.symbol}
        </span>
        <span className="col-span-3 md:text-left md:col-span-4 text-center">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
        <span className="col-span-2 justify-end ml-auto -mt-[3px]">
          <Pill
            text={
              transaction.status === "completed" &&
              transaction.bridgeStatus === "completed"
                ? "Complete"
                : transaction.status === "completed" &&
                  (transaction.bridgeStatus === "pending" ||
                    transaction.bridgeStatus === "processing")
                ? "Finishing"
                : transaction.status === "failed"
                ? "Failed"
                : "Pending"
            }
            type={
              transaction.status === "completed" &&
              transaction.bridgeStatus === "completed"
                ? "success"
                : "warning"
            }
          />
        </span>
      </div>
      {transaction.bridgeStatus === "in_flight" && (
        <div className="flex rounded-md px-3 md:px-2 py-[6px] bg-[#E9E9E9] mt-3 items-center mr-auto md:text-[10px]">
          <Image src={info} alt="info" className="h-3 mr-2 md:mr-1" />
          <span className="text-xs flex">
            Expected transaction completion time:{" "}
            <p className="font-semibold ml-1">
              {Math.ceil(
                getEstimatedTransactionTime(transaction.chainId) / 60
              ) + " min"}
            </p>
          </span>
        </div>
      )}
    </div>
  );
};

export default Transaction;
