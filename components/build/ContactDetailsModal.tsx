import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "@/store/store";
import { setIsContactDetailsModalOpen } from "@/store/operatorSlice";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import Button from "../ui/Button";
import Image from "next/image";
import close from "@/assets/close.svg";
import { useRouter } from "next/navigation";
import { path } from "@/lib/helpers";

const ContactDetailsModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "contact-details-modal-bg") {
        dispatch(setIsContactDetailsModalOpen(false));
      }
    });
  }, []);

  const submitContactDetails = () => {
    if (
      !signer ||
      (!firstNameRef.current || !firstNameRef.current.value.length) ||
      (!lastNameRef.current || !lastNameRef.current.value.length) ||
      (!emailRef.current || !emailRef.current.value.length)
    ) {
      return;
    }

    localStorage.setItem("Fuse-operatorContactDetail", JSON.stringify({
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
    }));

    router.push(path.DASHBOARD);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
        id="contact-details-modal-bg"
      >
        <motion.div
          initial={{ opacity: 0, top: "0" }}
          animate={{ opacity: 1, top: "50%" }}
          exit={{ opacity: 0, top: "0" }}
          transition={{
            duration: 0.3,
          }}
          className="bg-white min-h-[625px] md:min-h-[400px] w-[548px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pt-[47.5px] px-[62px] pb-[60px] md:px-5 md:py-8 rounded-[20px] flex flex-col"
        >
          <div className="flex">
            <p className="text-[34px]/[47.6px] font-bold">
              Contact details
            </p>
            <Image
              src={close}
              alt="close"
              className="cursor-pointer w-6 absolute top-[15px] right-5"
              onClick={() => {
                dispatch(setIsContactDetailsModalOpen(false));
              }}
            />
          </div>
          <p className="text-sm text-text-heading-gray pt-2 max-w-[416px] mr-auto">
            Share your contact details so we can stay in touch with you.
            You&apos;ll be the first to know about new features and special offers.
          </p>
          <form
            className="flex flex-col gap-[30px] w-full max-w-[441px] pt-[44.5px]"
            onSubmit={e => {
              e.preventDefault();
              submitContactDetails();
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first-name" className="text-text-heading-gray font-bold">
                First name
              </label>
              <input
                type="text"
                name="first-name"
                className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                ref={firstNameRef}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="last-name" className="text-text-heading-gray font-bold">
                Last name
              </label>
              <input
                type="text"
                name="last-name"
                className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                ref={lastNameRef}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-text-heading-gray font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                ref={emailRef}
                required
              />
            </div>
            <div className="mt-4">
              <Button
                text="Continue"
                className="bg-success font-bold leading-none w-full h-14 rounded-full"
                type="submit"
              />
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default ContactDetailsModal;
