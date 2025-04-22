"use client";
import React, {useState, useEffect, useRef, useCallback} from "react";
import Image from "next/image";
import {AnimatePresence, motion} from "framer-motion";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useAccount} from "wagmi";
import {useAppDispatch, useAppSelector} from "@/store/store";
import {
  delegateLicense,
  fetchDelegationsFromContract,
  selectNodesSlice,
  setRevokeLicenseModal,
  resetDelegationStatus,
} from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";
import close from "@/assets/close.svg";
import {Status, Node} from "@/lib/types";
import {Error} from "@/components/ui/Form";

type DelegateLicenseFormValues = {
  to: string;
  tokenId: number;
  amount: number;
};

// Custom hook for detecting clicks outside the modal
const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

const RevokeLicenseModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const {address} = useAccount();

  // Find the delegation matching the modal's address
  const delegation = nodesSlice.user.delegations.find(
    (delegation: Node) =>
      delegation.Address.toLowerCase() ===
      nodesSlice.revokeLicenseModal.address?.toLowerCase()
  );

  // Internal state to control modal visibility and delegation process
  const [isVisible, setIsVisible] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Sync internal visibility with Redux state
  useEffect(() => {
    setIsVisible(nodesSlice.revokeLicenseModal.open);
  }, [nodesSlice.revokeLicenseModal.open]);

  // Monitor delegation status
  useEffect(() => {
    // If we were revoking and now status is SUCCESS, don't close the modal automatically
    if (isRevoking && nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      setIsRevoking(false);
    }

    // If we were revoking and got an error, reset the revoking state
    if (isRevoking && nodesSlice.delegateLicenseStatus === Status.ERROR) {
      setIsRevoking(false);
    }
  }, [nodesSlice.delegateLicenseStatus, isRevoking]);

  // Handle closing the modal
  const handleCloseModal = useCallback(() => {
    // First update our internal state
    setIsVisible(false);

    // Reset the delegation status to IDLE when closing the modal
    if (nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      setTimeout(() => {
        dispatch(resetDelegationStatus());
      }, 100);
    }

    // Then dispatch Redux action to actually close the modal
    setTimeout(() => {
      dispatch(setRevokeLicenseModal({open: false}));
    }, 100);
  }, [dispatch, nodesSlice.delegateLicenseStatus]);

  const formik = useFormik<DelegateLicenseFormValues>({
    initialValues: {
      to: "0x",
      tokenId: 0,
      amount: 0,
    },
    validationSchema: Yup.object({
      to: Yup.string()
        .matches(
          /^0x[a-fA-F0-9]{40}$/,
          "Must start with 0x and be 42 characters long"
        )
        .required("Required"),
      tokenId: Yup.number()
        .max(10, "Must be 10 or less")
        .min(0, "Must be 0 or more")
        .required("Required"),
      amount: Yup.number()
        .max(10000, "Must be 10000 or less")
        .min(0, "Must be 0 or more")
        .required("Required"),
    }),
    onSubmit: (values) => {
      // Only allow submission if we're not already pending
      if (nodesSlice.delegateLicenseStatus !== Status.PENDING && !isRevoking) {
        setIsRevoking(true);

        console.log("Revoking license:", {
          to: values.to,
          tokenId: values.tokenId,
          amount: 0,
        });

        dispatch(
          delegateLicense({
            to: values.to as `0x${string}`,
            tokenId: values.tokenId,
            amount: 0,
          })
        );
      }
    },
  });

  // Set the address when modal opens or changes
  useEffect(() => {
    if (nodesSlice.revokeLicenseModal.address) {
      formik.setFieldValue("to", nodesSlice.revokeLicenseModal.address);
    }
  }, [nodesSlice.revokeLicenseModal.address]);

  // Set the amount and tokenId from delegation data when it's available
  useEffect(() => {
    if (delegation) {
      if (delegation.NFTAmount) {
        formik.setFieldValue("amount", delegation.NFTAmount);
      }
      if (delegation.NFTTokenID !== undefined) {
        formik.setFieldValue("tokenId", delegation.NFTTokenID);
      }
    }
  }, [delegation]);

  // Early return if modal is not visible
  if (!isVisible) {
    return <React.Fragment />;
  }

  const isSuccess = nodesSlice.delegateLicenseStatus === Status.SUCCESS;
  const isPending =
    nodesSlice.delegateLicenseStatus === Status.PENDING || isRevoking;
  const isError = nodesSlice.delegateLicenseStatus === Status.ERROR;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
      onClick={(e) => {
        // Only close if clicking the backdrop outside the modal
        if (e.target === e.currentTarget && !isPending) {
          handleCloseModal();
        }
      }}
    >
      <div
        className="bg-white w-[548px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pt-[47.5px] px-[62px] pb-[50px] md:px-5 md:py-8 rounded-[20px] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className="flex">
          <p className="text-[34px]/[47.6px] font-bold">
            {isSuccess ? "License Revoked" : "Confirm Revocation"}
          </p>
          <button
            type="button"
            className="cursor-pointer w-6 absolute top-[15px] right-5"
            onClick={handleCloseModal}
            disabled={isPending}
          >
            <Image src={close} alt="close" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-text-heading-gray">
              Your licenses have been successfully revoked from{" "}
              <strong>{nodesSlice.revokeLicenseModal.address}</strong>
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
              You are revoking all your licenses from{" "}
              <strong>{nodesSlice.revokeLicenseModal.address}</strong>
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
                  className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.to}
                  disabled
                />
                <Error touched={formik.touched.to} error={formik.errors.to} />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 w-1/3">
                  <div className="text-text-heading-gray font-bold">
                    Tier ID
                  </div>
                  <div className="relative">
                    <div className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full w-full h-[55px] flex items-center">
                      {formik.values.tokenId + 1}
                    </div>
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
                    min={1}
                    max={10000}
                    className="number-input bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    disabled
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
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Revoking License...
                    </>
                  ) : (
                    "Revoke License"
                  )}
                </button>

                {isError && (
                  <p className="text-[#FD0F0F] text-sm mt-2">
                    There was an error revoking your license. Please try again.
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

export default RevokeLicenseModal;
