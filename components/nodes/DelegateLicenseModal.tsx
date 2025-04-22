"use client";

import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Address} from "viem";

import {useAppDispatch, useAppSelector} from "@/store/store";
import {Error} from "@/components/ui/Form";
import {
  delegateLicense,
  selectNodesSlice,
  setDelegateLicenseModal,
  closeModal,
  resetDelegationStatus,
} from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";

import close from "@/assets/close.svg";
import {Status} from "@/lib/types";

type DelegateLicenseFormValues = {
  to: Address;
  tokenId: number;
  amount: number;
};

const DelegateLicenseModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const initialized = useRef(false);

  // Internal state to control modal visibility
  const [isVisible, setIsVisible] = useState(false);
  const isDelegatingRef = useRef(false);

  // Sync internal visibility with Redux state
  useEffect(() => {
    // Update our internal state based on Redux
    setIsVisible(nodesSlice.delegateLicenseModal.open);
  }, [nodesSlice.delegateLicenseModal.open]);

  // Handle closing the modal safely
  const handleCloseModal = useCallback(() => {
    // Don't allow closing during delegation
    if (isDelegatingRef.current) {
      console.log("Cannot close modal during delegation");
      return;
    }

    // First set our internal visibility to false
    setIsVisible(false);

    // Reset the delegation status to IDLE when closing the modal
    if (nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      setTimeout(() => {
        dispatch(resetDelegationStatus());
      }, 100);
    }

    // Then update Redux state with a small delay to prevent flashes
    setTimeout(() => {
      dispatch(setDelegateLicenseModal({open: false}));
    }, 50);
  }, [dispatch, nodesSlice.delegateLicenseStatus]);

  // Handle backdrop click - only close when clicking directly on the backdrop
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't allow closing during delegation
      if (isDelegatingRef.current) return;

      // Only close if the click is directly on the backdrop element (not any of its children)
      if (e.target === e.currentTarget) {
        e.preventDefault();
        handleCloseModal();
      }
    },
    [handleCloseModal]
  );

  // Combine licenses from old contract only - use useMemo instead of useEffect
  const availableLicenses = useMemo(() => {
    if (!nodesSlice.user || !nodesSlice.user.licences) return [];
    // Only use old contract licenses (from licences array, not newLicences)
    return nodesSlice.user.licences.filter((license) => license.balance > 0);
  }, [nodesSlice.user.licences]);

  const formik = useFormik<DelegateLicenseFormValues>({
    initialValues: {
      to: "0x",
      tokenId: 0,
      amount: 1,
    },
    validationSchema: Yup.object({
      to: Yup.string()
        .matches(
          /^0x[a-fA-F0-9]{40}$/,
          "Must start with 0x and be 42 characters long"
        )
        .required("Required"),
      tokenId: Yup.number()
        .max(9, "Must be 9 or less")
        .min(0, "Must be 0 or more")
        .required("Required"),
      amount: Yup.number()
        .max(10000, "Must be 10000 or less")
        .min(1, "Must be 1 or more")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        isDelegatingRef.current = true;

        await dispatch(
          delegateLicense({
            to: values.to,
            tokenId: values.tokenId,
            amount: values.amount,
          })
        ).unwrap();

        // Don't close the modal automatically on success
        isDelegatingRef.current = false;

        // Success is now handled by the render function based on delegateLicenseStatus
      } catch (error: any) {
        console.error("Delegation failed:", error);
        isDelegatingRef.current = false;
      }
    },
  });

  // Reset form and properly set initial tokenId when modal visibility changes
  const prevVisibleRef = useRef(isVisible);
  useEffect(() => {
    // When modal opens, initialize with the first available license
    if (!prevVisibleRef.current && isVisible && availableLicenses.length > 0) {
      // Reset and initialize form with first available license
      const firstLicense = availableLicenses[0];
      formik.setValues({
        to: nodesSlice.delegateLicenseModal.address || "0x",
        tokenId: firstLicense.tokenId - 1,
        amount: 1,
      });
      initialized.current = true;
    }

    // When modal closes, reset initialization flag
    if (prevVisibleRef.current && !isVisible) {
      initialized.current = false;

      // Delayed reset to avoid conflicts
      setTimeout(() => {
        formik.resetForm();
      }, 50);
    }

    // Update ref for next render
    prevVisibleRef.current = isVisible;
  }, [isVisible, availableLicenses, nodesSlice.delegateLicenseModal.address]);

  // Update to address when modal opens with a specific address
  const prevAddressRef = useRef(nodesSlice.delegateLicenseModal.address);
  useEffect(() => {
    const modalAddress = nodesSlice.delegateLicenseModal.address;

    // Only update when the address changes and is valid
    if (
      modalAddress &&
      modalAddress !== prevAddressRef.current &&
      formik.values.to === "0x"
    ) {
      formik.setFieldValue("to", modalAddress, false); // false = don't validate
    }

    // Update ref for next comparison
    prevAddressRef.current = modalAddress;
  }, [nodesSlice.delegateLicenseModal.address]); // Deliberately omit formik from deps

  // Early return if not visible
  if (!isVisible) {
    return <React.Fragment />;
  }

  // Create local variables for status checks
  const isSuccess = nodesSlice.delegateLicenseStatus === Status.SUCCESS;
  const isPending =
    nodesSlice.delegateLicenseStatus === Status.PENDING ||
    isDelegatingRef.current;
  const isError = nodesSlice.delegateLicenseStatus === Status.ERROR;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-[548px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pt-[47.5px] px-[62px] pb-[50px] md:px-5 md:py-8 rounded-[20px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex">
          <p className="text-[34px]/[47.6px] font-bold">
            {isSuccess ? "License Delegated" : "Delegate License"}
          </p>
          <button
            type="button"
            className="cursor-pointer absolute top-[15px] right-5"
            onClick={handleCloseModal}
            disabled={isDelegatingRef.current}
          >
            <Image src={close} alt="close" className="w-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-text-heading-gray">
              Your licenses have been successfully delegated to{" "}
              <strong>{formik.values.to}</strong>
            </p>
            <button
              type="button"
              onClick={handleCloseModal}
              className="mt-4 transition-all ease-in-out flex justify-center items-center gap-2 border rounded-full font-semibold leading-none p-4 
                bg-[rgb(180,249,186)] text-black border-[rgb(180,249,186)]
                hover:bg-[rgb(160,229,166)] hover:border-[rgb(160,229,166)]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-heading-gray pt-2 max-w-sm mr-auto">
              Delegate license to node sale provider for running the node on
              your behalf.
            </p>
            <form
              className="flex flex-col gap-3.5 w-full max-w-[441px] pt-[44.5px]"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="to"
                  className="text-text-heading-gray font-bold"
                >
                  To address
                </label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.to}
                  disabled={isDelegatingRef.current}
                />
                <Error touched={formik.touched.to} error={formik.errors.to} />
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 w-1/3">
                  <div className="text-text-heading-gray font-bold">
                    Tier ID
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full w-full h-[55px] flex items-center"
                      onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                      disabled={isDelegatingRef.current}
                    >
                      Tier {formik.values.tokenId + 1}
                    </button>
                    <AnimatePresence>
                      {isTierDropdownOpen && (
                        <motion.div
                          initial={{opacity: 0, height: 0}}
                          animate={{opacity: 1, height: "auto"}}
                          exit={{opacity: 0, height: 0}}
                          transition={{duration: 0.3}}
                          className="absolute top-full left-0 flex flex-wrap justify-center items-center w-full mt-1 bg-white rounded-[1.25rem] overflow-hidden z-10 shadow-xl"
                        >
                          {availableLicenses.map((license) => {
                            if (!license.balance) {
                              return null;
                            }
                            return (
                              <button
                                type="button"
                                key={license.tokenId}
                                className={`px-4 py-2 hover:bg-gray ${
                                  availableLicenses.length > 3
                                    ? "w-1/3"
                                    : "w-full"
                                }`}
                                onClick={() => {
                                  // Explicitly set tokenId and ensure it's updated immediately
                                  formik.setValues({
                                    ...formik.values,
                                    tokenId: license.tokenId - 1,
                                  });
                                  setIsTierDropdownOpen(false);
                                }}
                                disabled={isDelegatingRef.current}
                              >
                                <div className="flex flex-col items-center p-1">
                                  <span>Tier {license.tokenId}</span>
                                  <span className="text-gray-400">
                                    Balance: {license.balance}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Error
                    touched={formik.touched.tokenId}
                    error={formik.errors.tokenId}
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-2/3">
                  <label
                    htmlFor="amount"
                    className="text-text-heading-gray font-bold"
                  >
                    License amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min={0}
                    max={10000}
                    className="number-input bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    disabled={isDelegatingRef.current}
                  />
                  <Error
                    touched={formik.touched.amount}
                    error={formik.errors.amount}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="submit"
                  className={`transition-all ease-in-out flex justify-center items-center gap-2 border rounded-full font-semibold leading-none p-4 
                    ${
                      isError
                        ? "bg-[#FFEBE9] text-[#FD0F0F] border-[#FD0F0F]"
                        : "bg-[rgb(180,249,186)] text-black border-[rgb(180,249,186)] hover:bg-[rgb(160,229,166)] hover:border-[rgb(160,229,166)]"
                    }
                    disabled:bg-iron disabled:border-iron disabled:text-white disabled:cursor-not-allowed`}
                  disabled={isPending || formik.isSubmitting}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Delegating...
                    </>
                  ) : (
                    "Delegate"
                  )}
                </button>

                {isError && (
                  <p className="text-[#FD0F0F] text-sm mt-2">
                    There was an error delegating your license. Please try
                    again.
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DelegateLicenseModal;
