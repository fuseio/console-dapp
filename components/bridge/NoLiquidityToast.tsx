import React from "react";
import stop from "@/assets/stop.svg";
import dismiss from "@/assets/dismiss.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleLiquidityToast } from "@/store/toastSlice";
import Image from "next/image";

const NoLiquidityToast = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full rounded-md border-[#FD0F0F66]/40 border-[1px] bg-[#FFEBE9] md:mt-8">
      <div className="flex p-4">
        <Image src={stop} alt="history" className="h-6 w-[5%]" />
        <div className="flex flex-col w-[95%] ml-3">
          <div className="flex items-center justify-between">
            <p className="font-bold md:text-sm">
              Not enough liquidity to withdraw to the chosen network
            </p>
            <Image
              src={dismiss}
              alt="dismiss"
              className="h-5 cursor-pointer"
              onClick={() => {
                dispatch(toggleLiquidityToast(false));
              }}
            />
          </div>
          <p className="mt-1 md:text-sm">
            Unfortunately, at the moment there is not enough liquidity to
            withdraw the entered amount to the chosen network. Please choose a
            different destination network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoLiquidityToast;
