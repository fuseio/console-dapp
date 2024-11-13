import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsPayModalOpen } from "@/store/operatorSlice";
import Button from "../ui/Button";
import usdc from "@/assets/usdc.svg";
import usdt from "@/assets/usdt-logo.svg";
import close from "@/assets/close.svg";
import caretDown from "@/assets/caret-down.svg";

type Coin = {
  name: string;
  symbol: string;
  icon: StaticImageData;
}

type Coins = {
  [k: string]: Coin
}

type DetailProps = {
  title: string;
  description: string;
}

const coins: Coins = {
  "USDC": {
    name: "USD Coin",
    symbol: "USDC",
    icon: usdc,
  },
  "USDT": {
    name: "Tether USD",
    symbol: "USDT",
    icon: usdt,
  },
}

const months = [1, 3, 6, 12];

const Months = () => {
  return (
    <div className="flex justify-between items-center max-w-sm">
      <p className="font-semibold">
        Months:
      </p>
      <div className="flex justify-between items-center w-7/12">
        {months.map((month, index) => (
          <div key={month} className="flex items-center gap-2">
            <input
              type="radio"
              id={month.toString()}
              name={"month"}
              value={month.toString()}
              className="accent-gray checked:accent-black w-4 h-4"
              defaultChecked={index === 1}
            />
            <label htmlFor={month.toString()}>{month}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

const Token = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("USDT");

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
            <p>{coins[selectedToken].symbol}</p>
            <Image src={caretDown} alt="" width={10} height={6} />
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
                    {Object.keys(coins).map((coin) => (
                      <button
                        key={coin}
                        className="flex items-center gap-2"
                        onClick={() => {
                          setSelectedToken(coin)
                          setIsOpen(false)
                        }}
                        type="button"
                      >
                        <Image src={coins[coin].icon} alt={coins[coin].name} width={24} height={24} />
                        <p>{coins[coin].symbol}</p>
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

const Detail = ({ title, description }: DetailProps) => {
  return (
    <div className="flex justify-between items-center max-w-sm">
      <p className="font-semibold">
        {title}
      </p>
      <div className="flex justify-between items-center w-7/12">
        <p>
          {description}
        </p>
      </div>
    </div>
  )
}

const PayModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();

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
                <Months />
                <Token />
                <Detail title="Amount to pay:" description="$300" />
                <Detail title="Account Balance:" description="$426" />
                <Button
                  text="Pay"
                  className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black hover:text-black hover:bg-success rounded-full w-full max-w-sm mx-auto mt-6"
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
