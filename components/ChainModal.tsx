import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import close from "@/assets/close.svg";
import fuseGray from "@/assets/fuse-gray.svg";
import Button from "@/components/ui/Button";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { fuse } from "viem/chains";
import Image from "next/image";

type ChainModalProps = {
  description?: string;
}

const ChainModal = ({
  description = "Please switch to the Fuse Network to continue"
}: ChainModalProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { switchChain } = useSwitchChain()
  const { isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

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
            className="bg-white w-[400.88px] h-fit rounded-xl flex flex-col p-10 relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:w-full md:top-full md:-translate-y-full md:rounded-b-none md:p-4"
          >
            <Image
              src={close}
              alt="close"
              width={30}
              height={30}
              className="absolute top-7 right-6 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            <p className="text-2xl text-dune font-bold max-w-[218.24px]">
              Wrong Network Connected
            </p>
            <p className="text-sm	text-dove-gray font-medium max-w-[252.62px] my-[26.5px]">
              {description}
            </p>
            <Image
              src={fuseGray}
              alt="Fuse gray"
              className="m-auto"
              onClick={() => setIsOpen(false)}
            />
            <Button
              text="Switch to Fuse chain"
              className="transition ease-in-out w-full bg-success text-lg font-bold text-black rounded-xl mt-[31.7px] mb-2.5 hover:bg-black hover:text-white"
              padding="py-3.5"
              onClick={() => {
                switchChain({ chainId: fuse.id });
              }}
            />
            <Button
              text="Disconnect Wallet"
              className="transition ease-in-out w-full bg-dune text-lg font-bold text-white rounded-xl hover:bg-[#FFEBE9] hover:text-[#FD0F0F]"
              padding="py-3.5"
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ChainModal;
