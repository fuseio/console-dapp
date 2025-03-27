import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setWithdrawModal, withdraw } from "@/store/operatorSlice";
import Image from "next/image";
import down from "@/assets/down-arrow.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { Address } from "viem";
// import { hex } from "@/lib/helpers";
import gasIcon from "@/assets/gas.svg";
import { useSignMessage, useWalletClient } from "wagmi";
import { Status } from "@/lib/types";
import useTokenUsdBalance from "@/lib/hooks/useTokenUsdBalance";
import { cn } from "@/lib/helpers";
import Spinner from "../ui/Spinner";
import { coins } from "@/lib/hooks/useWithdrawToken";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import { useFormik } from "formik";
import * as Yup from 'yup';

type WithdrawFormValues = {
  to: Address | '';
  amount: string;
}

const gas = {
  "NATIVE": {
    gwei: "1500000",
    ether: "0.0015"
  },
  "CONTRACT": {
    gwei: "1336577",
    ether: "0.001336577"
  }
}

const WithdrawModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const [selectedCoin, setSelectedCoin] = useState("FUSE");
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);
  const { data: walletClient } = useWalletClient()
  const signer = useEthersSigner();
  const balance = useTokenUsdBalance({
    address: operatorSlice.withdrawModal?.from?.address ?? operatorSlice.operator.user.smartWalletAddress,
    contractAddress: coins[selectedCoin].address
  });
  const balanceValue = coins[selectedCoin].isNative ? balance.coin.value : balance.token.value;

  const formik = useFormik<WithdrawFormValues>({
    initialValues: {
      to: '',
      amount: '',
    },
    validationSchema: Yup.object({
      to: Yup.string().required('Required'),
      amount: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      if (
        parseFloat(values.amount) > balanceValue ||
        parseFloat(values.amount) <= 0
      ) {
        return;
      }

      if (operatorSlice.withdrawModal.from?.address) {
        signMessage({ message: "Verify your wallet ownership to migrate" });
      } else {
        handleWithdraw(values);
      }
    },
  });

  function handleWithdraw({ to, amount }: WithdrawFormValues) {
    if (!walletClient) {
      console.log("WalletClient not found")
      return;
    }

    if (!to) {
      console.log("To address not found")
      return;
    }

    dispatch(withdraw({
      walletClient,
      amount,
      to,
      decimals: coins[selectedCoin].decimals,
      token: selectedCoin,
      coinGeckoId: coins[selectedCoin].coinGeckoId,
      contractAddress: coins[selectedCoin].address
    }));
  }

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess(data) {
        if (!signer) {
          console.log("Signer not found")
          return;
        }

        if (!formik.values.to) {
          console.log("To address not found")
          return;
        }

        const gasFee = 0.01;
        const amount = parseFloat(formik.values.amount) - gasFee;

        dispatch(withdraw({
          walletClient: signer,
          signature: data,
          amount: amount.toString(),
          to: formik.values.to,
          decimals: coins[selectedCoin].decimals,
          token: selectedCoin,
          coinGeckoId: coins[selectedCoin].coinGeckoId,
          contractAddress: coins[selectedCoin].address,
        }));
      }
    }
  })

  const coinDropdownRef = useOutsideClick<HTMLButtonElement>(() => {
    if (isCoinDropdownOpen) {
      setIsCoinDropdownOpen(false);
    }
  });

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "withdraw-modal-bg") {
        dispatch(setWithdrawModal({
          open: false
        }));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (operatorSlice.withdrawModal.to?.address && !formik.values.to) {
      formik.setFieldValue("to", operatorSlice.withdrawModal.to.address)
    }
  }, [formik, operatorSlice.withdrawModal.to?.address])

  return (
    <AnimatePresence>
      {operatorSlice.withdrawModal.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="withdraw-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[203px] w-[525px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="px-8 py-10 flex flex-col gap-8">
              <div className="flex flex-col gap-5 items-center text-center">
                <p className="text-3xl leading-none font-bold">
                  {operatorSlice.withdrawModal.title ?? "Withdraw funds"}
                </p>
                <p className="text-text-heading-gray max-w-[302px]">
                  {operatorSlice.withdrawModal.description ?? "You can withdraw funds to any wallet address on the Fuse Network"}
                </p>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-text-dark-gray">
                    <p>
                      Amount
                    </p>
                    <p>
                      Balance: {balanceValue} {selectedCoin}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2.5">
                    <div className={cn("flex justify-between items-center gap-4 px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full",
                      (formik.errors.amount && formik.touched.amount) && "border-[#FD0F0F]"
                    )}>
                      <input
                        type="text"
                        name="amount"
                        placeholder="0.00"
                        max={balanceValue}
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"text-2xl text-text-dark-gray font-medium w-full focus:outline-none"}
                      />
                      <button
                        type="button"
                        className="bg-lightest-gray text-sm leading-none font-medium px-3 py-2 rounded-full"
                        onClick={() => formik.setFieldValue("amount", balanceValue)}
                      >
                        Max
                      </button>
                    </div>
                    <button
                      type="button"
                      className="relative flex items-center gap-2 bg-soft-peach rounded-full px-3.5 py-3 w-40 md:w-60"
                      onClick={() => setIsCoinDropdownOpen(!isCoinDropdownOpen)}
                      ref={coinDropdownRef}
                    >
                      <Image
                        src={coins[selectedCoin].icon}
                        alt={coins[selectedCoin].name}
                        width={30}
                        height={30}
                      />
                      <p className="text-sm leading-none font-semibold">
                        {selectedCoin}
                      </p>
                      <Image
                        src={down}
                        alt="down"
                        className={`${isCoinDropdownOpen && "rotate-180"}`}
                        width={10}
                        height={10}
                      />
                      {isCoinDropdownOpen &&
                        <div className="absolute z-10 top-[120%] left-1/2 -translate-x-1/2 bg-soft-peach rounded-[20px] px-2 py-4 flex flex-col items-start gap-4 w-max">
                          {Object.entries(coins).map(([key, coin]) => (
                            <div
                              key={key}
                              onClick={() => setSelectedCoin(key)}
                              className="flex gap-2 items-center"
                            >
                              <Image
                                src={coins[key].icon}
                                alt={coins[key].name}
                                width={30}
                                height={30}
                              />
                              <p>
                                {coin.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      }
                    </button>
                  </div>
                </div>
                {operatorSlice.withdrawModal?.from?.address && (
                  <div className="flex flex-col gap-2">
                    <p className="text-text-dark-gray">
                      {operatorSlice.withdrawModal.from.title}
                    </p>
                    <input
                      type="text"
                      name="from"
                      value={operatorSlice.withdrawModal.from.address}
                      className="px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full text-2xl text-text-dark-gray font-medium w-full focus:outline-none disabled:bg-inactive"
                      disabled
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-text-dark-gray">
                    {operatorSlice.withdrawModal.to?.title ?? "Wallet address on Fuse Network"}
                  </p>
                  <input
                    type="text"
                    name="to"
                    placeholder={"0x"}
                    value={formik.values.to}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn("px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full text-2xl text-text-dark-gray font-medium w-full focus:outline-none disabled:bg-inactive",
                      (formik.errors.to && formik.touched.to) && "border-[#FD0F0F]"
                    )}
                    disabled={!!operatorSlice.withdrawModal.from?.address}
                  />
                </div>
                <div
                  title="Gas Estimate"
                  className="w-full flex justify-end items-center gap-1 text-sm text-text-dark-gray mb-2"
                >
                  <Image
                    src={gasIcon}
                    alt="gas estimate"
                    width={12}
                    height={12}
                  />
                  <p>
                    {coins[selectedCoin].isNative ? gas.NATIVE.gwei : gas.CONTRACT.gwei} Gwei {operatorSlice.withdrawModal.from?.address ? '' : '(sponsored)'}
                  </p>
                </div>
                <button
                  type="submit"
                  className={cn("transition ease-in-out w-full flex justify-center items-center gap-4 text-lg leading-none font-semibold rounded-full px-12 py-4",
                    parseFloat(formik.values.amount) > balanceValue ? "bg-[#FFEBE9] text-[#FD0F0F]" :
                      parseFloat(formik.values.amount) < 0 ? "bg-gray text-white" :
                        "bg-black text-white hover:bg-success hover:text-black"
                  )}
                  disabled={parseFloat(formik.values.amount) > balanceValue || parseFloat(formik.values.amount) <= 0}
                >
                  {parseFloat(formik.values.amount) > balanceValue ?
                    "Insufficient balance" :
                    parseFloat(formik.values.amount) < 0 ?
                      "Incorrect amount" :
                      operatorSlice.withdrawModal.from?.address ?
                        "Migrate" :
                        "Withdraw"
                  }
                  {operatorSlice.withdrawStatus === Status.PENDING && <Spinner />}
                </button>
                {operatorSlice.withdrawStatus === Status.ERROR && (
                  <p className="mt-4 text-center max-w-md">
                    An error occurred. Please try to Deposit more funds or change Amount.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default WithdrawModal;
