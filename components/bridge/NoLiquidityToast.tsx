import React from "react";
import stop from "@/assets/stop.svg";
import dismiss from "@/assets/dismiss.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectTransactionsSlice } from "@/store/transactionsSlice";
import { toggleLiquidityToast } from "@/store/toastSlice";

const NoLiquidityToast = () => {
  const transactionsSlice = useAppSelector(selectTransactionsSlice);
  const dispatch = useAppDispatch();
  return (
    <div className="w-full rounded-md border-[#FD0F0F66]/40 border-[1px] bg-[#FFEBE9] md:mt-8">
      <div className="flex p-4">
        <img src={stop.src} alt="history" className="h-6 w-[5%]" />
        <div className="flex flex-col w-[95%] ml-3">
          <div className="flex items-center justify-between">
            <p className="font-bold md:text-sm">No Liquidity</p>
            <img
              src={dismiss.src}
              alt="dismiss"
              className="h-5 cursor-pointer"
              onClick={() => {
                dispatch(toggleLiquidityToast(false));
              }}
            />
          </div>
          <p className="mt-1 md:text-sm">
            Unfortunately, at the moment there is not enough liquidity to
            complete the transaction. Choose a different token or a smaller
            amount.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoLiquidityToast;
