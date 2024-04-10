import React from "react";
import stopGreen from "@/assets/stop-green.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleLiquidityToast } from "@/store/toastSlice";
import {
  selectLiquiditySlice,
} from "@/store/liquiditySlice";
import { setDepositChainItem } from "@/store/selectedChainSlice";
import Image from "next/image";

const SwitchChainToast = () => {
  const dispatch = useAppDispatch();
  const liquiditySlice = useAppSelector(selectLiquiditySlice);
  return (
    <div className="w-full rounded-md border-[#03900F]/40 border-[1px] bg-[#E2FFE5] mt-3">
      <div className="flex p-4">
        <Image
          src={stopGreen}
          alt="stop"
          className="h-6 w-[5%] fill-[#03900F]"
        />
        <div className="flex flex-col w-[95%] ml-3">
          <div className="flex items-center justify-between">
            <p className="font-bold md:text-sm">
              Switch to any of the following networks to proceed
            </p>
          </div>
          <div className="w-full flex mt-2">
            {liquiditySlice.chains.map((chain, i) => {
              if (
                parseFloat(chain.liquidity) > parseFloat(liquiditySlice.amount)
              )
                return (
                  <div
                    className="group flex items-center cursor-pointer mr-6"
                    key={i}
                    onClick={() => {
                      dispatch(setDepositChainItem(i));
                      dispatch(toggleLiquidityToast(false));
                    }}
                  >
                    <div className="w-3 h-3 rounded-full outline outline-2 border-2 border-[#E2FFE5] outline-[#8C9196] group-hover:outline-[#03900F] group-hover:bg-[#03900F] cursor-pointer" />
                    <span className="ml-2 text-xs font-medium text-[#797979] group-hover:text-[#03900F]">
                      {chain.name}
                    </span>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchChainToast;
