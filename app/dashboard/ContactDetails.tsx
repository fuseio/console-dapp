import { useRef } from "react";
import Button from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { createOperator, selectOperatorSlice } from "@/store/operatorSlice";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import AccountCreationModal from "@/components/operator/AccountCreationModal";
import CongratulationModal from "@/components/operator/CongratulationModal";

const ContactDetails = () => {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const submitContactDetails = () => {
    if (
      !signer ||
      (!firstNameRef.current || !firstNameRef.current.value.length) ||
      (!lastNameRef.current || !lastNameRef.current.value.length) ||
      (!emailRef.current || !emailRef.current.value.length)
    ) {
      return;
    }

    dispatch(createOperator({
      signer,
      operatorContactDetail: {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
      }
    }));
  }

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      {operatorSlice.isAccountCreationModalOpen && <AccountCreationModal />}
      {operatorSlice.isCongratulationModalOpen && <CongratulationModal />}
      <div className="w-8/9 flex flex-col gap-[72.9px] items-center mt-16 mb-[187px] md:w-9/10 max-w-7xl">
        <div className="flex flex-col gap-[94.13px] text-center">
          <h1 className="text-[50px]/[60.25px] text-fuse-black font-semibold">
            Contact details
          </h1>
          <p className="text-text-heading-gray max-w-[461.35px]">
            Share your contact details so we can stay in touch with you.
            You&apos;ll be the first to know about new features and special offers.
          </p>
        </div>
        <form
          className="flex flex-col gap-[38px] w-full max-w-[441px]"
          onSubmit={e => {
            e.preventDefault();
            submitContactDetails();
          }}
        >
          <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-4">
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
              text="Get started"
              className="bg-success font-bold leading-none w-full h-14 rounded-full"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactDetails;
