import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import partyPopper from "@/assets/party-popper.svg"
import { setIsCongratulationModalOpen } from "@/store/operatorSlice";
import { useAppDispatch } from "@/store/store";
import Button from "../ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as amplitude from "@amplitude/analytics-browser";
import { walletType } from "@/lib/helpers";
import { useAccount } from "wagmi";

const CongratulationModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { connector } = useAccount();

  useEffect(() => {
    amplitude.track("New Operator Created", {
      walletType: connector ?
        walletType[connector.id] :
        localStorage.getItem("Fuse-connectedWalletType") ?? undefined,
    });
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
      >
        <motion.div
          initial={{ opacity: 0, top: "0" }}
          animate={{ opacity: 1, top: "50%" }}
          exit={{ opacity: 0, top: "0" }}
          transition={{
            duration: 0.3,
          }}
          className="bg-white min-h-[382px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl p-5 items-center flex flex-col justify-center text-center gap-8"
        >
          <Image
            src={partyPopper}
            alt="party popper"
            width={79.36}
            height={79.36}
          />
          <div className="flex flex-col gap-2.5">
            <p className="text-3xl/[29.01px] font-bold">
              Congratulations!
            </p>
            <div className="flex flex-col">
              <p className="text-text-heading-gray">
                Your account has been successfully
              </p>
              <p className="text-text-heading-gray">
                created. It&apos;s time to top it up.
              </p>
            </div>
          </div>
          <Button
            text="Continue"
            className="bg-black text-sm font-medium text-white rounded-full"
            padding="px-10 py-3"
            onClick={() => {
              dispatch(setIsCongratulationModalOpen(false));
              router.push("/dashboard");
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default CongratulationModal;
