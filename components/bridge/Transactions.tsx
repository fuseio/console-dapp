import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cross from "@/assets/cross.svg";
import Transaction from "./Transaction";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchBridgeTransactions,
  selectTransactionsSlice,
} from "@/store/transactionsSlice";
import { Address } from "abitype";
import { useAccount } from "wagmi";
import Image from "next/image";

interface TransactionProps {
  delegators?: [Address, string][] | undefined;
  isOpen: boolean;
  onToggle: (arg: boolean) => void;
  isLoading?: boolean;
}

const Transactions = ({ isOpen, onToggle }: TransactionProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        onToggle(false);
      }
    });
  }, [onToggle]);
  const transactionsSlice = useAppSelector(selectTransactionsSlice);
  useEffect(() => {
    if (address && isOpen) {
      dispatch(fetchBridgeTransactions(address));
    }
  }, [address, dispatch, isOpen]);
  return (
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
            initial={{ opacity: 0, right: "-100%" }}
            animate={{ opacity: 1, right: "0%" }}
            exit={{ opacity: 0, right: "-100%" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white h-screen w-[50%] right-0 absolute p-6 flex flex-col items-start overflow-y-auto z-50 md:hidden"
          >
            <Image
              src={cross}
              alt="cross"
              className="bg-modal-bg p-1 rounded-md cursor-pointer"
              onClick={() => {
                onToggle(false);
              }}
              height={24}
            />
            <span className="text-2xl font-semibold mt-4 mb-2">
              Transactions History
            </span>
            {transactionsSlice.transactions.map((transaction, i) => {
              return <Transaction transaction={transaction} key={i} />;
            })}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, top: "100%" }}
            animate={{ opacity: 1, top: "20%" }}
            exit={{ opacity: 0, top: "100%" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white h-screen w-[100%] absolute p-6 flex-col items-start overflow-y-auto z-50 hidden md:flex rounded-lg"
          >
            <span className="text-base font-semibold mb-2">
              Transactions History
            </span>
            <div className="flex w-full h-[75%] flex-col overflow-y-auto">
              {transactionsSlice.transactions.map((transaction, i) => {
                return <Transaction transaction={transaction} key={i} />;
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Transactions;
