import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Address } from "viem";
import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { Error } from "@/components/ui/Form";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { delegateLicense, selectNodesSlice, setRevokeLicenseModal } from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";

import close from "@/assets/close.svg";
import { Status } from "@/lib/types";

type DelegateLicenseFormValues = {
  to: Address;
  tokenId: number;
  amount: number;
}

const RevokeLicenseModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const { address } = useAccount();
  const delegation = nodesSlice.user.delegations.find((delegation) => delegation.Address === nodesSlice.revokeLicenseModal.address)

  const modalRef = useOutsideClick(() => {
    if (nodesSlice.revokeLicenseModal.open) {
      dispatch(setRevokeLicenseModal({ open: false }));
    }
  });

  const formik = useFormik<DelegateLicenseFormValues>({
    initialValues: {
      to: '0x',
      tokenId: 0,
      amount: 0,
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
      dispatch(delegateLicense({ ...values, amount: 0 }));
    },
  });

  useEffect(() => {
    if (nodesSlice.revokeLicenseModal.address && formik.values.to === '0x') {
      formik.setFieldValue('to', nodesSlice.revokeLicenseModal.address);
    }
  }, [formik, nodesSlice.revokeLicenseModal.address]);

  useEffect(() => {
    if (delegation?.NFTAmount && !formik.values.amount) {
      formik.setFieldValue('amount', delegation.NFTAmount);
    }
  }, [delegation?.NFTAmount, formik]);

  return (
    <AnimatePresence>
      {nodesSlice.revokeLicenseModal.open && (
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
                Confirm Revocation
              </p>
              <Image
                src={close}
                alt="close"
                className="cursor-pointer w-6 absolute top-[15px] right-5"
                onClick={() => {
                  dispatch(setRevokeLicenseModal({ open: false }));
                }}
              />
            </div>
            <p className="text-sm text-text-heading-gray pt-2 max-w-sm mr-auto">
              You are revoking all your licenses from <strong>{address}</strong>
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
                    <button
                      type="button"
                      className="bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full w-full h-[55px] flex items-center"
                      onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
                    >
                      {formik.values.tokenId}
                    </button>
                    <AnimatePresence>
                      {isTierDropdownOpen && (
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
                    className="number-input bg-white border-[0.5px] border-gray-alpha-40 py-[17.5px] px-[34.81px] rounded-full h-[55px] placeholder:text-text-dark-gray disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    disabled
                  />
                  <Error touched={formik.touched.amount} error={formik.errors.amount} />
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="submit"
                  className={`transition-all ease-in-out flex justify-center items-center gap-2 border rounded-full font-semibold leading-none p-4 disabled:bg-iron disabled:border-iron enabled:hover:bg-[transparent] enabled:hover:border-black enabled:hover:text-black ${nodesSlice.delegateLicenseStatus === Status.ERROR ? "bg-[#FFEBE9] text-[#FD0F0F]" : "border-black bg-black text-white"}`}
                >
                  {nodesSlice.delegateLicenseStatus === Status.SUCCESS ? "Revoked" : "Confirm"}
                  {nodesSlice.delegateLicenseStatus === Status.PENDING && <Spinner />}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RevokeLicenseModal;
