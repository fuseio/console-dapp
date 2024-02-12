import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import close from "@/assets/close.svg";
import QRCode from "react-qr-code";

type QrModalProps = {
  value: string;
  size: number;
  setIsQrModalOpen: (isModal: boolean) => void;
}

const QrModal = ({ value, size, setIsQrModalOpen }: QrModalProps): JSX.Element => {
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "qr-modal-bg") {
        setIsQrModalOpen(false);
      }
    });
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
        id="qr-modal-bg"
      >
        <motion.div
          initial={{ opacity: 0, top: "0" }}
          animate={{ opacity: 1, top: "50%" }}
          exit={{ opacity: 0, top: "0" }}
          transition={{
            duration: 0.3,
          }}
          className="bg-white min-h-[300px] w-[300px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 px-8 py-8 md:px-5 md:py-8 rounded-[20px] flex flex-col justify-center items-center"
        >
          <Image
              src={close}
              alt="close"
              className="cursor-pointer w-6 absolute top-[15px] right-5"
              onClick={() => {
                setIsQrModalOpen(false);
              }}
            />
            <QRCode
              size={size}
              value={value}
            />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default QrModal;
