import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Address } from "viem";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchErc20Balance, selectOperatorSlice, setIsPayModalOpen } from "@/store/operatorSlice";
import Button from "../ui/Button";
import usdc from "@/assets/usdc.svg";
import usdt from "@/assets/usdt-logo.svg";
import close from "@/assets/close.svg";
import caretDown from "@/assets/caret-down.svg";

type Coin = {
  name: string;
  decimals: number;
  icon: StaticImageData;
  address: Address;
}

type Coins = {
  [k: string]: Coin
}

type MonthsProps = {
  setSelectedMonth: (time: number) => void;
}

type DetailProps = {
  title: string;
  description: string;
  isLoading?: boolean;
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
}

const months = [
  {
    time: 1,
    price: 100,
  },
  {
    time: 3,
    price: 300,
  },
  {
    time: 6,
    price: 600,
  },
  {
    time: 12,
    price: 1200,
  },
];

const Months = ({ setSelectedMonth }: MonthsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  return (
    <div className="flex justify-between items-center max-w-sm">
      <p className="font-semibold">
        Months:
      </p>
      <div className="flex justify-between items-center w-7/12">
        {months.map((month, index) => (
          <div key={month.time} className="flex items-center gap-2">
            <input
              type="radio"
              id={month.time.toString()}
              name={"month"}
              value={month.time.toString()}
              className="accent-gray checked:accent-black w-4 h-4"
              defaultChecked={index === 1}
              onChange={handleChange}
            />
            <label htmlFor={month.time.toString()}>{month.time}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

const Token = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("USDT");

  useEffect(() => {
    dispatch(fetchErc20Balance({
      contractAddress: coins[selectedToken].address,
      address: operatorSlice.operator.user.smartWalletAddress,
      decimals: coins[selectedToken].decimals,
    }))
  }, [dispatch, operatorSlice.operator.user.smartWalletAddress, selectedToken])

  return (
    <div className="flex justify-between items-center max-w-sm">
      <p className="font-semibold">
        Token:
      </p>
      <div className="flex justify-between items-center w-7/12">
        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <Image src={coins[selectedToken].icon} alt={coins[selectedToken].name} width={24} height={24} />
            <p>{selectedToken}</p>
            <Image src={caretDown} alt="caret down" width={10} height={6} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute top-6 left-0 w-[137px]"
              >
                <div className="bg-white shadow-xl px-2.5 py-3.5 z-2 flex flex-col gap-3">
                  <p>
                    Tokens
                  </p>
                  <div className="flex flex-col gap-3">
                    {Object.entries(coins).map(([key, coin]) => (
                      <button
                        key={key}
                        className="flex items-center gap-2"
                        onClick={() => {
                          setSelectedToken(key)
                          setIsOpen(false)
                        }}
                        type="button"
                      >
                        <Image src={coin.icon} alt={coin.name} width={24} height={24} />
                        <p>{key}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const Detail = ({ title, description, isLoading }: DetailProps) => {
  return (
    <div className="flex justify-between items-center max-w-sm">
      <p className="font-semibold">
        {title}
      </p>
      <div className="flex justify-between items-center w-7/12">
        {isLoading ?
          <span className="w-10 h-5 rounded-md animate-pulse bg-fuse-black/10"></span> :
          <p>{description}</p>
        }
      </div>
    </div>
  )
}

const PayModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const [selectedMonth, setSelectedMonth] = useState(3);

  const amountToPay = months.find((month) => month.time === selectedMonth)?.price;
  const isInsufficientBalance = parseFloat(operatorSlice.erc20Balance) < (amountToPay ?? 0);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "pay-modal-bg") {
        dispatch(setIsPayModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {operatorSlice.isPayModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="pay-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[600px] w-[592px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl"
          >
            <Image
              src={close}
              alt="close"
              width={24}
              height={24}
              className="absolute top-5 right-6 cursor-pointer"
              onClick={() => dispatch(setIsPayModalOpen(false))}
            />
            <div className="px-16 py-[80px] flex flex-col gap-10 md:px-6 md:py-10">
              <div className="flex flex-col gap-2 text-center">
                <p className="text-2xl font-bold">
                  Pay for Pro Plan
                </p>
                <p>
                  Prepay Pro plan for a period of 1 to 12 months. We currently only accept USDC and USDT.
                </p>
              </div>

              <form className="flex flex-col gap-9">
                <Months setSelectedMonth={setSelectedMonth} />
                <Token />
                <Detail title="Amount to pay:" description={`$${amountToPay}`} />
                <Detail title="Account Balance:" description={`$${operatorSlice.erc20Balance || 0}`} isLoading={operatorSlice.isFetchingErc20Balance} />
                <Button
                  text="Pay"
                  className={`transition ease-in-out text-lg leading-none font-semibold enabled:hover:text-black enabled:hover:bg-success rounded-full w-full max-w-sm mx-auto mt-6 ${isInsufficientBalance ? "bg-[#FFEBE9] text-[#FD0F0F]" : "bg-black text-white"}`}
                  disabled={isInsufficientBalance}
                  padding="py-4 px-11"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default PayModal;
