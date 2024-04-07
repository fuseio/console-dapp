import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsTopupAccountModalOpen } from "@/store/operatorSlice";
import copy from "@/assets/copy-black.svg";
import qr from "@/assets/qr.svg";
import leftArrow from "@/assets/left-arrow.svg";
import Image from "next/image";
import { eclipseAddress } from "@/lib/helpers";
import QRCode from "react-qr-code";
import Copy from "../ui/Copy";
import close from "@/assets/close.svg";

const TopupAccountModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [isQrCodeOpen, setIsQrCodeOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "topup-account-modal-bg") {
        dispatch(setIsTopupAccountModalOpen(false));
        setIsQrCodeOpen(false);
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {operatorSlice.isTopupAccountModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="topup-account-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className={`bg-white min-h-[203px] ${isQrCodeOpen ? "w-[300px]" : "w-[525px]"} max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl`}
          >
            {isQrCodeOpen ?
              <div className="p-5 flex flex-col gap-4">
                <button
                  className="flex items-center gap-3 w-fit"
                  onClick={() => setIsQrCodeOpen(!isQrCodeOpen)}
                >
                  <Image
                    src={leftArrow}
                    alt="back arrow icon"
                    width={11.39}
                    height={5.7}
                  />
                  Back
                </button>
                <div className="flex justify-center">
                  <QRCode
                    size={220}
                    value={String(operatorSlice.operator.user.smartContractAccountAddress)}
                  />
                </div>
              </div> :
              <div className="relative pt-[60px] px-8 pb-[66px] flex flex-col">
                <Image
                  src={close}
                  alt="close"
                  className="cursor-pointer w-6 absolute top-[15px] right-5"
                  onClick={() => {
                    dispatch(setIsTopupAccountModalOpen(false));
                  }}
                />
                <div className="flex flex-col gap-2 items-center text-center">
                  <p className="text-3xl leading-none font-bold">
                    Top up account balance
                  </p>
                  <p className="text-text-heading-gray max-w-[461.35px]">
                    To activate your account send at least 10 FUSE tokens to your smart wallet
                    address on the Fuse network. You can always withdraw the funds.
                  </p>
                </div>
                <div className="flex justify-between items-center px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full mt-12">
                  <p className="text-2xl leading-none text-text-dark-gray font-medium">
                    {eclipseAddress(operatorSlice.operator.user.smartContractAccountAddress)}
                  </p>
                  <div className="flex justify-between w-full max-w-[55px]">
                    <Copy
                      src={copy}
                      text={String(operatorSlice.operator.user.smartContractAccountAddress)}
                      alt="copy smart contract account address"
                      width={18.97}
                      height={18.81}
                    />
                    <Image
                      src={qr}
                      alt="copy smart contract account address"
                      width={16.22}
                      height={16.65}
                      className="cursor-pointer"
                      onClick={() => setIsQrCodeOpen(!isQrCodeOpen)}
                    />
                  </div>
                </div>
              </div>
            }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TopupAccountModal;
