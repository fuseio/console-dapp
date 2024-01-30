import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchErc20Balance, selectOperatorSlice, setIsWithdrawModalOpen, withdraw } from "@/store/operatorSlice";
import Button from "../ui/Button";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import Image, { StaticImageData } from "next/image";
import down from "@/assets/down-arrow.svg";
import usdc from "@/assets/usdc.svg";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { Address } from "viem";
import { hex } from "@/lib/helpers";

type WithdrawModalProps = {
  balance: string;
}

type Coin = {
  name: string;
  decimals: number;
  icon: StaticImageData;
  address?: Address;
  isNative?: boolean;
}

type Coins = {
  [k: string]: Coin
}

const coins: Coins = {
  "USDC": {
    name: "USD Coin",
    decimals: 6,
    icon: usdc,
    address: "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A",
  },
  "USDT": {
    name: "Tether USD",
    decimals: 6,
    icon: usdt,
    address: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
  },
  "WETH": {
    name: "Wrapped Ether",
    decimals: 18,
    icon: weth,
    address: "0x5622F6dC93e08a8b717B149677930C38d5d50682",
  },
  "FUSE": {
    name: "Fuse",
    decimals: 18,
    icon: sFuse,
    isNative: true,
  },
}

const WithdrawModal = ({ balance }: WithdrawModalProps): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("0.00");
  const [address, setAddress] = useState<Address>(hex);
  const signer = useEthersSigner();
  const [selectedCoin, setSelectedCoin] = useState("FUSE");
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);

  const coinDropdownRef = useOutsideClick<HTMLButtonElement>(() => {
    if (isCoinDropdownOpen) {
      setIsCoinDropdownOpen(false);
    }
  });

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "withdraw-modal-bg") {
        dispatch(setIsWithdrawModalOpen(false));
      }
    });
  }, []);

  return (
    <AnimatePresence>
      {operatorSlice.isWithdrawModalOpen && (
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
            <div className="pt-[60px] px-8 pb-[66px] flex flex-col">
              <div className="flex flex-col gap-5 items-center text-center">
                <p className="text-3xl leading-none font-bold">
                  Withdraw funds
                </p>
                <p className="text-text-heading-gray max-w-[302px]">
                  You can withdraw funds to any wallet address on the Fuse Network
                </p>
              </div>
              <div className="flex justify-between items-center mt-9 text-text-dark-gray">
                <p>
                  Amount
                </p>
                <p>
                  Balance: {new Intl.NumberFormat().format(Number(coins[selectedCoin].isNative ? balance : operatorSlice.erc20Balance))} {selectedCoin}
                </p>
              </div>
              <div className="flex justify-between gap-2.5 mt-4 mb-6">
                <div className="flex justify-between items-center gap-4 px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full">
                  <input
                    type="text"
                    name="amount"
                    max={balance}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="text-2xl text-text-dark-gray font-medium w-full focus:outline-none"
                  />
                  <Button
                    text="Max"
                    className="bg-lightest-gray text-sm leading-none font-medium px-2 py-1 rounded-full"
                    onClick={() => {
                      setAmount(balance)
                    }}
                  />
                </div>
                <button
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
                    src={down.src}
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
                          onClick={() => {
                            if (!coins[key].isNative) {
                              dispatch(fetchErc20Balance({
                                contractAddress: coins[key].address!,
                                address: operatorSlice.operator.user.smartContractAccountAddress,
                                decimals: coins[key].decimals,
                              }))
                            }
                            setSelectedCoin(key);
                          }}
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
              <p className="text-text-dark-gray">
                Wallet address on Fuse Network
              </p>
              <input
                type="text"
                name="address"
                value={address}
                onChange={e => setAddress(e.target.value as Address)}
                className="px-7 py[16.5px] border-[0.5px] border-gray-alpha-40 h-[55px] rounded-full mb-6 text-2xl text-text-dark-gray font-medium w-full focus:outline-none"
              />
              <Button
                text={Number(amount) > Number(coins[selectedCoin].isNative ? balance : operatorSlice.erc20Balance) ? "Insufficient balance" : Number(amount) < 0 ? "Incorrect amount" : "Withdraw"}
                disabled={Number(amount) > Number(coins[selectedCoin].isNative ? balance : operatorSlice.erc20Balance) || Number(amount) <= 0 ? true : false}
                className={`w-full flex justify-center items-center gap-4 text-lg leading-none font-semibold rounded-full ${Number(amount) > Number(coins[selectedCoin].isNative ? balance : operatorSlice.erc20Balance) ? "bg-[#FFEBE9] text-[#FD0F0F]" : Number(amount) < 0 ? "bg-gray text-white" : "bg-black text-white"}`}
                padding="px-12 py-4"
                onClick={() => {
                  if (signer && Number(amount) <= Number(coins[selectedCoin].isNative ? balance : operatorSlice.erc20Balance) && Number(amount) > 0) {
                    dispatch(withdraw({
                      signer,
                      amount,
                      to: address,
                      decimals: coins[selectedCoin].decimals,
                      isNative: coins[selectedCoin].isNative,
                      contractAddress: coins[selectedCoin].address
                    }));
                  }
                }}
              >
                {operatorSlice.isWithdrawing && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default WithdrawModal;