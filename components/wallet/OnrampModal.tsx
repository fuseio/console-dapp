import React, { useEffect } from "react";
import { motion } from "framer-motion";
import cross from "@/assets/close.svg";
import transakLogo from "@/assets/transak-logo.svg";
import transfiLogo from "@/assets/transfi-logo.svg";
import paybisLogo from "@/assets/paybis-logo.svg";
import rampLogo from "@/assets/ramp-logo.svg";
import Image from "next/image";

interface OnrampModalProps {
  isOpen: boolean;
  onToggle: (arg: boolean) => void;
  onTransfiToggle: (arg: boolean) => void;
}

const OnrampModal = ({
  isOpen,
  onToggle,
  onTransfiToggle,
}: OnrampModalProps): JSX.Element => {
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        onToggle(false);
      }
    });
  }, [onToggle]);
  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex"
          id="modal-bg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
            }}
            className="bg-white w-5/12 h-min rounded-xl flex flex-col items-start justify-start p-6 relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:w-full md:top-full md:-translate-y-full md:rounded-b-none"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-text-primary text-lg flex items-start justify-between">
                  <span className="font-bold">
                    Buy Fuse
                  </span>
                  <Image
                    src={cross}
                    className="cursor-pointer w-6 h-6"
                    onClick={() => {
                      onToggle(!isOpen);
                    }}
                    alt="close"
                  />
                </div>
                <p className="text-lighter-gray">
                  ???????????????????????????
                </p>
              </div>
              <div className="grid grid-cols-auto-fit-250 gap-3">
                <div className="flex flex-col justify-start items-start gap-6 border border-light-blue rounded pl-4 pt-4 pr-16 pb-[18px] cursor-pointer transition ease-in-out delay-150 hover:bg-lighter-blue">
                  <Image src={transakLogo} alt="Transak logo" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      Payment methods
                    </p>
                    <p className="text-lighter-gray text-sm font-medium">
                      Debit/Creadit cared, Bank transfer, Apple pay
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-6 border border-light-blue rounded pl-4 pt-4 pr-16 pb-[18px] cursor-pointer transition ease-in-out delay-150 hover:bg-lighter-blue">
                  <Image src={rampLogo} alt="Ramp logo" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      Payment methods
                    </p>
                    <p className="text-lighter-gray text-sm font-medium">
                      Debit/Creadit cared, Bank transfer, Apple pay
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-6 border border-light-blue rounded pl-4 pt-4 pr-16 pb-[18px] cursor-pointer transition ease-in-out delay-150 hover:bg-lighter-blue">
                  <Image src={paybisLogo} alt="Paybis logo" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      Payment methods
                    </p>
                    <p className="text-lighter-gray text-sm font-medium">
                      Debit/Creadit cared, Bank transfer, Apple pay
                    </p>
                  </div>
                </div>
                <div
                  className="flex flex-col justify-start items-start gap-6 border border-light-blue rounded pl-4 pt-4 pr-16 pb-[18px] cursor-pointer transition ease-in-out delay-150 hover:bg-lighter-blue"
                  onClick={() => {
                    onToggle(false);
                    onTransfiToggle(true);
                  }}
                >
                  <Image src={transfiLogo} alt="TransFi logo" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      Payment methods
                    </p>
                    <p className="text-lighter-gray text-sm font-medium">
                      Debit/Creadit cared, Bank transfer, Apple pay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
export default OnrampModal;
