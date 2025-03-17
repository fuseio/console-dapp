import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWalletClient } from "wagmi";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsSubscriptionModalOpen, setIsTopupAccountModalOpen, subscription } from "@/store/operatorSlice";
import Spinner from "../ui/Spinner";
import { getERC20Balance } from "@/lib/erc20";
import { cn, hex, subscriptionInformation } from "@/lib/helpers";
import { BillingCycle, Status } from "@/lib/types";

const SubscriptionModal = (): JSX.Element => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const dispatch = useAppDispatch();
  const { data: walletClient } = useWalletClient()
  const [usdcBalance, setUsdcBalance] = useState(0)
  const subscriptionInfo = subscriptionInformation()
  const proratedAmount = subscriptionInfo.calculateProrated(BillingCycle.MONTHLY)
  const isSufficientBalance = usdcBalance >= proratedAmount
  const smartWalletAddress = operatorSlice.operator?.user?.smartWalletAddress

  function handleClick() {
    if (!isSufficientBalance) {
      dispatch(setIsSubscriptionModalOpen(false))
      dispatch(setIsTopupAccountModalOpen(true))
      return
    }

    if (!walletClient) {
      return
    }
    dispatch(subscription({ walletClient }))
  }

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "subscription-modal-bg") {
        dispatch(setIsSubscriptionModalOpen(false));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (!smartWalletAddress || smartWalletAddress === hex) {
        return
      }
      const balance = await getERC20Balance(
        subscriptionInfo.usdcAddress,
        smartWalletAddress
      )
      setUsdcBalance(Number(balance))
    })()
  }, [smartWalletAddress, subscriptionInfo.usdcAddress])

  return (
    <AnimatePresence>
      {operatorSlice.isSubscriptionModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="subscription-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-black text-white min-h-[203px] w-fit max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl flex flex-col gap-8 p-10"
          >
            <p className="text-2xl leading-none font-bold">
              Subscription
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col items-start gap-2">
                <p>
                  Plan
                </p>
                <div className="border-[3px] border-success rounded-full px-3 py-2 text-sm leading-none font-bold">
                  Basic plan
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p>
                  Billed
                </p>
                <div className="border-[3px] border-success rounded-full px-3 py-2 text-sm leading-none font-bold">
                  Monthly
                </div>
              </div>
              {subscriptionInfo.payment !== proratedAmount && (
                <div className="flex flex-col items-start gap-2">
                  <p>
                    Prorated
                  </p>
                  <div className="border-[3px] border-success rounded-full px-3 py-2 text-sm leading-none font-bold">
                    ${proratedAmount}
                  </div>
                </div>
              )}
            </div>
            <hr className="w-full h-[0.5px] border-white/50" />
            <div className="flex flex-col gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[3.125rem] leading-none font-semibold">
                  ${subscriptionInfo.payment}
                </span>
                <span className="text-sm leading-none text-white/60">
                  Per month / Annual allowance
                </span>
              </div>
              <button
                className={cn("transition ease-in-out flex justify-center items-center gap-2 p-3 leading-none font-semibold border rounded-full hover:bg-[transparent]",
                  (!isSufficientBalance || operatorSlice.subscriptionStatus === Status.ERROR) ? 'bg-[#FD0F0F] border-[#FD0F0F] text-white hover:text-[#FD0F0F]' : 'bg-white border-white text-black hover:text-white'
                )}
                onClick={handleClick}
              >
                {operatorSlice.subscriptionStatus === Status.ERROR ? 'Error while subscribing' : isSufficientBalance ? 'Pay Now' : 'Insufficient USDC in smart wallet'}
                {operatorSlice.subscriptionStatus === Status.PENDING && <Spinner />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
