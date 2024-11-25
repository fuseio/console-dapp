import React from "react";
import LastTransactionToast from "./LastTransactionToast";
import { useAppSelector } from "@/store/store";
import { selectToastSlice } from "@/store/toastSlice";
import NoLiquidityToast from "./NoLiquidityToast";
import SwitchChainToast from "./SwitchChainToast";

type ToastPaneProps = {
  className?: string;
};

const ToastPane = ({ className = "" }: ToastPaneProps) => {
  const toastSlice = useAppSelector(selectToastSlice);
  return (
    <div
      className={
        "flex flex-col pt-8 justify-start items-center w-full md:pt-0 pe-14 " + className
      }
    >
      {toastSlice.isLiquidityToastOpen && <NoLiquidityToast />}
      {toastSlice.isLiquidityToastOpen && <SwitchChainToast />}
      {toastSlice.isLastTransactionToastOpen && <LastTransactionToast />}
    </div>
  );
};

export default ToastPane;
