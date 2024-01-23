import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { regenerateSecretApiKey, selectOperatorSlice, setIsRollSecretKeyModalOpen } from "@/store/operatorSlice";
import Button from "../ui/Button";

const RollSecretKeyModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "roll-secret-key-modal-bg") {
        dispatch(setIsRollSecretKeyModalOpen(false));
      }
    });
  }, []);

  return (
    <AnimatePresence>
      {operatorSlice.isRollSecretKeyModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="roll-secret-key-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[150px] w-[400px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="px-4 py-8 flex flex-col">
              <div className="flex flex-col gap-2 items-center text-center">
                <p className="text-3xl leading-none font-bold">
                  Roll API secret key
                </p>
                <p className="text-text-heading-gray max-w-[300px]">
                  Rolling will block your current API secret key and generate a new one
                </p>
              </div>
              <div className="flex justify-between items-center gap-4 mt-6 mx-auto">
                <Button
                  text="Roll"
                  className="flex justify-between items-center gap-2 text-lg text-white font-semibold bg-red-600 rounded-full"
                  padding="py-1 px-6"
                  onClick={() => {
                    dispatch(regenerateSecretApiKey());
                  }}
                >
                  {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                </Button>
                <Button
                  text="Cancel"
                  className="text-lg text-black font-semibold border border-black rounded-full"
                  padding="py-1 px-6"
                  onClick={() => {
                    dispatch(setIsRollSecretKeyModalOpen(false));
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default RollSecretKeyModal;
