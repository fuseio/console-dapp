import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Address} from "viem";
import {useAccount} from "wagmi";

import {useAppDispatch, useAppSelector} from "@/store/store";
import {Error} from "@/components/ui/Form";
import {
  selectNodesSlice,
  setDelegateLicenseModal,
  resetDelegationStatus,
  delegateNewNodeLicense,
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
  const {address} = useAccount();
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const initialized = useRef(false);
  const isDelegatingRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(nodesSlice.delegateLicenseModal.open);
  }, [nodesSlice.delegateLicenseModal.open]);

  useEffect(() => {
    if (
      isDelegatingRef.current &&
      nodesSlice.delegateNewLicenseStatus === Status.SUCCESS
    ) {
      isDelegatingRef.current = false;
    }

    if (
      isDelegatingRef.current &&
      nodesSlice.delegateNewLicenseStatus === Status.ERROR
    ) {
      isDelegatingRef.current = false;
    }
  }, [nodesSlice.delegateNewLicenseStatus]);

  const handleCloseModal = useCallback(() => {
    setIsVisible(false);

    if (nodesSlice.delegateNewLicenseStatus === Status.SUCCESS) {
      setTimeout(() => {
        dispatch(resetDelegationStatus());
      }, 100);
    }

    setTimeout(() => {
      dispatch(setDelegateLicenseModal({open: false}));
    }, 100);
  }, [dispatch, nodesSlice.delegateNewLicenseStatus]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isDelegatingRef.current) {
        handleCloseModal();
      }
    },
    [handleCloseModal, isDelegatingRef]
  );

  const availableLicenses = useMemo(() => {
    if (!nodesSlice.user || !nodesSlice.user.newLicences) return [];
    return nodesSlice.user.newLicences.filter((license) => license.balance > 0);
  }, [nodesSlice.user]);

  const availableTokensForDelegation = useMemo(() => {
    if (
      !nodesSlice.user ||
      !nodesSlice.user.newLicences ||
      !nodesSlice.user.newDelegations
    ) {
      return {};
    }

    const available: Record<number, number> = {};
    nodesSlice.user.newLicences.forEach((license) => {
      available[license.tokenId] = license.balance;
    });

    nodesSlice.user.newDelegations.forEach((delegation) => {
      const tokenId = delegation.NFTTokenID + 1;
      if (available[tokenId]) {
        available[tokenId] = Math.max(
          0,
          available[tokenId] - delegation.NFTAmount
        );
      }
    });

    return available;
  }, [nodesSlice.user]);

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
          delegateNewNodeLicense({
            to: values.to,
            tokenId: values.tokenId,
            amount: values.amount,
            userAddress: address,
          })
        ).unwrap();

        isDelegatingRef.current = false;
      } catch (error: any) {
        console.error("Delegation failed:", error);
        isDelegatingRef.current = false;
      }
    },
  });

  const prevVisibleRef = useRef(isVisible);
  useEffect(() => {
    if (!prevVisibleRef.current && isVisible && availableLicenses.length > 0) {
      const firstLicense = availableLicenses[0];
      formik.setValues({
        to: nodesSlice.delegateLicenseModal.address || "0x",
        tokenId: firstLicense.tokenId - 1,
        amount: 1,
      });
      initialized.current = true;
    }

    if (prevVisibleRef.current && !isVisible) {
      initialized.current = false;

      setTimeout(() => {
        formik.resetForm();
      }, 50);
    }

    prevVisibleRef.current = isVisible;
  }, [isVisible, availableLicenses, nodesSlice.delegateLicenseModal.address]);

  const prevAddressRef = useRef(nodesSlice.delegateLicenseModal.address);
  useEffect(() => {
    const modalAddress = nodesSlice.delegateLicenseModal.address;

    if (
      modalAddress &&
      modalAddress !== prevAddressRef.current &&
      formik.values.to === "0x"
    ) {
      formik.setFieldValue("to", modalAddress, false);
    }

    prevAddressRef.current = modalAddress;
  }, [nodesSlice.delegateLicenseModal.address]);

  if (!isVisible) {
    return <React.Fragment />;
  }

  const isSuccess = nodesSlice.delegateNewLicenseStatus === Status.SUCCESS;
  const isPending =
    nodesSlice.delegateNewLicenseStatus === Status.PENDING ||
    isDelegatingRef.current;
  const isError = nodesSlice.delegateNewLicenseStatus === Status.ERROR;

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
              <div className="text-sm text-text-heading-gray">
                <span className="font-medium">Available for delegation:</span>
                <span className="ml-1">
                  {availableTokensForDelegation[formik.values.tokenId + 1] || 0}{" "}
                  tokens
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="submit"
                  className={`transition-all ease-in-out flex justify-center items-center gap-2 border rounded-full font-semibold leading-none p-4 hover:bg-[transparent]
                      ${
                        isError
                          ? "bg-[#FFEBE9] text-[#FD0F0F] border-[#FD0F0F]"
                          : "bg-[rgb(180,249,186)] text-black border-[rgb(180,249,186)] hover:border-black enabled:hover:text-black"
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
