import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const AccountCreationModal = (): JSX.Element => {
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
          className="bg-white min-h-[344px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 items-center flex flex-col justify-center text-center gap-2.5"
        >
          <p className="text-3xl/[29.01px] font-bold">
            Account creation
          </p>
          <div className="flex flex-col">
            <p className="text-text-heading-gray">
              Your operator account is about to be deployed!
            </p>
            <p className="text-text-heading-gray">
              The process may take 10-15 seconds, please wait.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default AccountCreationModal;
