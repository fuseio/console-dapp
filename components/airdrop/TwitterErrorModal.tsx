import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice, setIsTwitterErrorModalOpen } from "@/store/airdropSlice";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

import close from "@/assets/close.svg";
import twitter from "@/assets/twitter-x.svg";

const TwitterErrorModal = (): JSX.Element => {
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const dispatch = useAppDispatch();

  const modalRef = useOutsideClick(() => {
    if (airdropSlice.isTwitterErrorModalOpen) {
      dispatch(setIsTwitterErrorModalOpen(false));
    }
  });

  return (
    <AnimatePresence>
      {airdropSlice.isTwitterErrorModalOpen && (
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
            ref={modalRef}
            className="bg-white bg-linear-gradient-orange min-h-[400px] w-[540px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => dispatch(setIsTwitterErrorModalOpen(false))}
            >
              <Image
                src={close}
                alt="close"
                width={40}
                height={40}
              />
            </button>
            <div className="flex flex-col items-center gap-6 px-10 py-12 text-center">
              <Image
                src={twitter}
                alt="twitter"
                width={200}
                height={200}
              />
              <p className="text-[2.125rem] leading-none font-semibold">
                This X account has already been used
              </p>
              <p>
                It is not allowed to use the same X account with multiple wallets participating in the Ember Rewards campaign.
              </p>
              <button
                className="transition ease-in-out flex justify-center items-center gap-2 bg-black enabled:border-2 enabled:border-black rounded-full px-8 py-3 text-lg leading-none enabled:text-white font-bold enabled:hover:bg-[transparent] enabled:hover:text-black disabled:bg-lightest-gray"
                onClick={() => dispatch(setIsTwitterErrorModalOpen(false))}
              >
                Ok
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TwitterErrorModal;
