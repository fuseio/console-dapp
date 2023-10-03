import React from "react";
import LastTransactionToast from "./LastTransactionToast";
import { useAppSelector } from "@/store/store";
import { selectToastSlice } from "@/store/toastSlice";
import NoLiquidityToast from "./NoLiquidityToast";

type ToastPaneProps = {
  className?: string;
};

const ToastPane = ({ className = "" }: ToastPaneProps) => {
  const toastSlice = useAppSelector(selectToastSlice);
  return (
    <div
      className={
        "flex flex-col pt-8 justify-start items-center w-full md:pt-0 " + className
      }
    >
      {toastSlice.isLiquidityToastOpen && <NoLiquidityToast />}
      {toastSlice.isLastTransactionToastOpen && <LastTransactionToast />}
    </div>
  );
};

export default ToastPane;
