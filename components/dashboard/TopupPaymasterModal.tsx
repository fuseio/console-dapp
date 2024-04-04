import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fundPaymaster, selectOperatorSlice, setIsTopupPaymasterModalOpen } from "@/store/operatorSlice";
import Button from "../ui/Button";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";

type TopupPaymasterModalProps = {
  balance: string;
}

const TopupPaymasterModal = ({ balance }: TopupPaymasterModalProps): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("0.00");
  const signer = useEthersSigner();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "topup-paymaster-modal-bg") {
        dispatch(setIsTopupPaymasterModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {operatorSlice.isTopupPaymasterModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="topup-paymaster-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[203px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="pt-[60px] px-8 pb-[66px] flex flex-col">
              <div className="flex flex-col gap-5 items-center text-center">
                <p className="text-3xl leading-none font-bold">
                  Top up Paymaster
                </p>
                <p className="text-text-heading-gray max-w-[302px]">
                  Paymaster allows you to cover the transaction fees of your customers.
                </p>
              </div>
              <div className="flex flex-col gap-[15.5px] mt-11 mb-[28.5px]">
                <p className="text-xs text-center">
                  Balance: {new Intl.NumberFormat().format(Number(balance))} FUSE
                </p>
                <div className="flex justify-between items-center gap-4 px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full">
                  <input
                    type="text"
                    name="amount"
                    max={balance}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="text-2xl text-text-dark-gray font-medium w-full focus:outline-none"
                  />
                  <Button
                    text="Max"
                    className="bg-lightest-gray text-sm leading-none font-medium px-2 py-1 rounded-full"
                    onClick={() => {
                      setAmount(balance)
                    }}
                  />
                </div>
              </div>
              <Button
                text={Number(amount) > Number(balance) ? "Insufficient balance" : Number(amount) < 0 ? "Incorrect amount" : "Top up Paymaster"}
                disabled={Number(amount) > Number(balance) || Number(amount) <= 0 ? true : false}
                className={`w-full flex justify-center items-center gap-4 text-lg leading-none font-semibold rounded-full ${Number(amount) > Number(balance) ? "bg-[#FFEBE9] text-[#FD0F0F]" : Number(amount) < 0 ? "bg-gray text-white" : "bg-black text-white"}`}
                padding="px-12 py-4"
                onClick={() => {
                  if (signer && Number(amount) <= Number(balance) && Number(amount) > 0) {
                    dispatch(fundPaymaster({ signer, amount }));
                  }
                }}
              >
                {operatorSlice.isFundingPaymaster && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TopupPaymasterModal;
