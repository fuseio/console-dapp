import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { setIsCongratulationModalOpen } from "@/store/operatorSlice";
import { useAppDispatch } from "@/store/store";

const CongratulationModal = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "modal-bg") {
        dispatch(setIsCongratulationModalOpen(false));
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
        id="modal-bg"
      >
        <motion.div
          initial={{ opacity: 0, top: "0" }}
          animate={{ opacity: 1, top: "50%" }}
          exit={{ opacity: 0, top: "0" }}
          transition={{
            duration: 0.3,
          }}
          className="bg-white min-h-[382px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 items-center flex flex-col"
        >
          Congratulations!
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default CongratulationModal;
