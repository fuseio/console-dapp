"use client";
import React, {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useAccount} from "wagmi";
import {useAppDispatch, useAppSelector} from "@/store/store";
import {
  delegateLicense,
  selectNodesSlice,
  setRevokeLicenseModal,
  resetDelegationStatus,
} from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";
import close from "@/assets/close.svg";
import {Status, Node} from "@/lib/types";
import {Error} from "@/components/ui/Form";
import {Address} from "viem";

type DelegateLicenseFormValues = {
  to: Address;
  tokenId: number;
  amount: number;
};

const RevokeLicenseModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const {address} = useAccount();

  const delegation = nodesSlice.user.delegations.find(
    (delegation: Node) =>
      delegation.Address.toLowerCase() ===
      nodesSlice.revokeLicenseModal.address?.toLowerCase()
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Reference to store timeout IDs for cleanup
  const timeoutIds = React.useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setIsVisible(nodesSlice.revokeLicenseModal.open);
  }, [nodesSlice.revokeLicenseModal.open]);

  useEffect(() => {
    if (isRevoking && nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      setIsRevoking(false);
    }

    if (isRevoking && nodesSlice.delegateLicenseStatus === Status.ERROR) {
      setIsRevoking(false);
    }
  }, [nodesSlice.delegateLicenseStatus, isRevoking]);

  const handleCloseModal = useCallback(() => {
    setIsVisible(false);

    if (nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      const timeoutId = setTimeout(() => {
        dispatch(resetDelegationStatus());
      }, 100);
      // Store timeout ID for cleanup
      timeoutIds.current.push(timeoutId);
    }

    const modalTimeoutId = setTimeout(() => {
      dispatch(setRevokeLicenseModal({open: false}));
    }, 100);
    // Store timeout ID for cleanup
    timeoutIds.current.push(modalTimeoutId);
  }, [dispatch, nodesSlice.delegateLicenseStatus]);

  useEffect(() => {
    // Cleanup function to clear all timeouts when component unmounts
    return () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };
  }, []);

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
      if (nodesSlice.delegateLicenseStatus !== Status.PENDING && !isRevoking) {
        setIsRevoking(true);

        dispatch(
          delegateLicense({
            ...values,
            tokenId: values.tokenId,
            amount: 0,
            userAddress: address,
          })
        );
      }
    },
  });

  useEffect(() => {
    if (nodesSlice.revokeLicenseModal.address) {
      formik.setFieldValue("to", nodesSlice.revokeLicenseModal.address);
    }
  }, [nodesSlice.revokeLicenseModal.address]);

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
        if (e.target === e.currentTarget && !isPending) {
          handleCloseModal();
        }
      }}
    >
      <div
        className="bg-white w-[548px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pt-[47.5px] px-[62px] pb-[50px] md:px-5 md:py-8 rounded-[20px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
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
