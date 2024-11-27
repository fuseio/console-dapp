import React, { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice, setIsWaitlistModalOpen } from "@/store/airdropSlice";

import close from "@/assets/close.svg";
import emailIcon from "@/assets/email-orange.svg";
import RightArrow from "@/assets/RightArrow";

const WaitlistModal = (): JSX.Element => {
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "waitlist-modal-bg") {
        dispatch(setIsWaitlistModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {airdropSlice.isWaitlistModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="waitlist-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white bg-linear-gradient-orange text-center min-h-[500px] w-[400px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <Image
              src={close}
              alt="close"
              width={40}
              height={40}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => dispatch(setIsWaitlistModalOpen(false))}
            />
            <div className="px-4 py-8 min-h-[inherit] flex flex-col justify-center items-center gap-4">
              <Image
                src={emailIcon}
                alt="email icon"
                width={75}
                height={75}
              />
              <p className="text-2xl leading-none font-semibold">
                Join the waitlist
              </p>
              <p className="text-fuse-black max-w-52">
                Please enter your email to join our waitlist.
              </p>
              <form
                className="flex bg-light-gray rounded-full mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 bg-light-gray rounded-full"
                  required
                />
                <button type="submit" className="transition-all ease-in-out bg-black border border-black text-white p-4 rounded-full hover:bg-light-gray hover:text-black">
                  <RightArrow />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default WaitlistModal;
