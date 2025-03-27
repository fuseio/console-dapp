import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Iframe from "react-iframe";
import { NEXT_PUBLIC_TRANSFI_API_KEY } from "@/lib/config";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNavbarSlice, setIsTransfiModalOpen } from "@/store/navbarSlice";

const TransfiModal = (): JSX.Element => {
  const { isTransfiModalOpen } = useAppSelector(selectNavbarSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "transfi-modal-bg") {
        dispatch(setIsTransfiModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <>
      {isTransfiModalOpen &&
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-60 flex"
          id="transfi-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
            }}
            className="bg-white w-5/12 h-min rounded-xl flex flex-col items-start justify-start p-6 relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:w-full md:top-full md:-translate-y-full md:rounded-b-none"
          >
            <Iframe
              height="625px"
              title="TransFi Ramp Widget"
              url={`https://buy.transfi.com?apiKey=${NEXT_PUBLIC_TRANSFI_API_KEY}&cryptoTicker=FUSE`}
              styles={{ display: "block", width: "100%", maxHeight: "625px" }}
            />
          </motion.div>
        </div>
      }
    </>
  );
};
export default TransfiModal;
