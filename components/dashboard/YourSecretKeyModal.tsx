import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsYourSecretKeyModalOpen, setOperator } from "@/store/operatorSlice";
import copy from "@/assets/copy-black.svg";
import Button from "../ui/Button";
import Copy from "../ui/Copy";
import { splitSecretKey } from "@/lib/helpers";

const YourSecretKeyModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();

  return (
    <AnimatePresence>
      {operatorSlice.isYourSecretKeyModalOpen && (
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
            className="bg-white min-h-[203px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="px-8 py-10 flex flex-col">
              <div className="flex flex-col gap-2 items-center text-center">
                <p className="text-3xl leading-none font-bold">
                  Your API Secret key
                </p>
                <p className="text-text-heading-gray max-w-[400px]">
                  Save and store this new API key to a secure place, such as a password manager or secret store.
                  You won&apos;t be able to see it again.
                </p>
              </div>
              <div className="flex justify-between items-center px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full mt-12 mb-6">
                <p className="text-xl leading-none text-text-dark-gray font-medium">
                  {operatorSlice.operator.project.secretKey}
                </p>
                <Copy
                  src={copy}
                  text={String(operatorSlice.operator.project.secretKey)}
                  alt="copy API secret key"
                  width={18.97}
                  height={18.81}
                />
              </div>
              <div>
                <Button
                  text="Done"
                  className="transition ease-in-out w-full text-lg text-black font-semibold bg-fuse-green-bright rounded-full hover:bg-black hover:text-white"
                  onClick={() => {
                    const secretKey = operatorSlice.operator.project.secretKey;
                    const { secretPrefix, secretLastFourChars } = splitSecretKey(secretKey);
                    const operator = {
                      ...operatorSlice.operator,
                      project: {
                        ...operatorSlice.operator.project,
                        secretKey: "",
                        secretPrefix,
                        secretLastFourChars
                      }
                    }
                    dispatch(setOperator(operator));
                    dispatch(setIsYourSecretKeyModalOpen(false));
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
export default YourSecretKeyModal;
