import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from "@/store/store";
import { Error } from "@/components/ui/Form";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { delegateLicense, fetchNodeLicenseBalances, selectNodesSlice, setIsDelegateLicenseModalOpen } from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";

import close from "@/assets/close.svg";
import { Status } from "@/lib/types";
import { useEffect } from "react";

type DelegateLicenseFormValues = {
  to: Address;
  tokenId: number;
  amount: number;
}

const DelegateLicenseModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const { address } = useAccount();
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const isBalance = nodesSlice.user.licences.some((licence) => licence.balance);

  const modalRef = useOutsideClick(() => {
    if (nodesSlice.isDelegateLicenseModalOpen) {
      dispatch(setIsDelegateLicenseModalOpen(false));
    }
  });

  const formik = useFormik<DelegateLicenseFormValues>({
    initialValues: {
      to: '0x',
      tokenId: 0,
      amount: 1,
    },
    validationSchema: Yup.object({
      to: Yup.string()
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Must start with 0x and be 42 characters long')
        .required('Required'),
      tokenId: Yup.number()
        .max(9, 'Must be 9 or less')
        .min(0, 'Must be 0 or more')
        .required('Required'),
      amount: Yup.number()
        .max(10000, 'Must be 10000 or less')
        .min(1, 'Must be 1 or more')
        .required('Required'),
    }),
    onSubmit: values => {
      dispatch(delegateLicense(values));
    },
  });

  useEffect(() => {
    if (address) {
      dispatch(fetchNodeLicenseBalances({
        accounts: Array.from({ length: 10 }, () => address),
        tokenIds: Array.from({ length: 10 }, (_, i) => i),
      }));
    }
  }, [address, dispatch]);

  return (
    <AnimatePresence>
      {nodesSlice.isDelegateLicenseModalOpen && (
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
            className="bg-white w-[548px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pt-[47.5px] px-[62px] pb-[50px] md:px-5 md:py-8 rounded-[20px] flex flex-col"
          >
            <div className="flex">
              <p className="text-[34px]/[47.6px] font-bold">
                Delegate License
              </p>
              <Image
                src={close}
                alt="close"
                className="cursor-pointer w-6 absolute top-[15px] right-5"
                onClick={() => {
                  dispatch(setIsDelegateLicenseModalOpen(false));
                }}
              />
            </div>
            <p className="text-sm text-text-heading-gray pt-2 max-w-sm mr-auto">
              Delegate license to node sale provider for running the node on your behalf.
            </p>
            <form
              className="flex flex-col gap-3.5 w-full max-w-[441px] pt-[44.5px]"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="to" className="text-text-heading-gray font-bold">
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
                    >
                      {formik.values.tokenId}
                    </button>
                    <AnimatePresence>
                      {isTierDropdownOpen && isBalance && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-full left-0 flex flex-wrap justify-center items-center w-full mt-1 bg-white rounded-[1.25rem] overflow-hidden z-10 shadow-xl"
                        >
                          {nodesSlice.user.licences.map((licence) => {
                            if (!licence.balance) {
                              return null;
                            }
                            return (
                              <button
                                type="button"
                                key={licence.tokenId}
                                className={`px-4 py-2 hover:bg-gray ${nodesSlice.user.licences.length > 3 ? "w-1/3" : "w-full"}`}
                                onClick={() => {
                                  formik.setFieldValue('tokenId', licence.tokenId);
                                  formik.setFieldTouched('tokenId', true);
                                  setIsTierDropdownOpen(false);
                                }}
                              >
                                {licence.tokenId}
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Error touched={formik.touched.tokenId} error={formik.errors.tokenId} />
                </div>
                <div className="flex flex-col gap-1.5 w-2/3">
                  <label htmlFor="amount" className="text-text-heading-gray font-bold">
                    License amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min={1}
                    max={10000}
                    className="number-input bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                  />
                  <Error touched={formik.touched.amount} error={formik.errors.amount} />
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="submit"
                  className={`transition-all ease-in-out flex justify-center items-center gap-2 border rounded-full font-semibold leading-none p-4 disabled:bg-iron disabled:border-iron enabled:hover:bg-[transparent] enabled:hover:border-black enabled:hover:text-black ${nodesSlice.deligateLicenseStatus === Status.ERROR ? "bg-[#FFEBE9] text-[#FD0F0F]" : "border-success bg-success"}`}
                  disabled={!isBalance}
                >
                  {nodesSlice.deligateLicenseStatus === Status.SUCCESS ? "Delegated" : isBalance ? "Delegate" : "No license"}
                  {nodesSlice.deligateLicenseStatus === Status.PENDING && <Spinner />}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DelegateLicenseModal;
