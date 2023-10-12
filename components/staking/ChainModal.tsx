import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import refresh from "@/assets/refresh.svg"
import Button from "@/components/ui/Button";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { fuse } from "viem/chains";

const ChainModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { switchNetwork } = useSwitchNetwork()
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (isConnected && chain?.id !== fuse.id) setIsOpen(true);
    else setIsOpen(false);
  }, [chain, isConnected]);

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
            className="bg-white w-[525] h-fit rounded-xl flex flex-col items-center justify-start text-center gap-4 p-8 relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:w-full md:top-full md:-translate-y-full md:rounded-b-none md:p-4"
          >
            <img src={refresh.src} alt="Switch network" />
            <p className="text-xl/5 font-bold">You need to switch network</p>
            <div className="max-w-[461px]">
              <p>To use Staking on Fuse you must be connected to the Fuse network</p>
            </div>
            <Button
                text="Switch To Fuse"
                className="bg-black text-sm font-medium text-white rounded-full"
                padding="px-4 py-3"
                onClick={() => {
                  switchNetwork && switchNetwork(fuse.id)
                }}
              />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ChainModal;
