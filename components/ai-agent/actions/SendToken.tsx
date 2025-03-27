import { useEffect } from "react";
import { Address, parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

import Spinner from "@/components/ui/Spinner";
import { ChatMessageProps } from "@/lib/types";
import { updateMessage } from "@/store/aiSlice";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { useAppDispatch } from "@/store/store";

type SendTokenContent = {
  amount: string;
  toAddress: Address;
}

const SendToken = ({ message }: ChatMessageProps) => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const content = message.content as SendTokenContent;

  const {
    data: hash,
    error,
    isPending,
    sendTransaction
  } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const isLoading = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed && hash) {
      dispatch(updateMessage({
        message: {
          ...message,
          hash
        }
      }));
    }
  }, [dispatch, hash, isConfirmed, message]);

  return (
    <button
      className={`transition ease-in-out flex items-center gap-2 w-fit px-4 py-3 text-lg leading-none font-semibold rounded-full hover:bg-[transparent] hover:text-black ${error?.message ? "bg-[#FFEBE9] border border-[#FD0F0F] text-[#FD0F0F]" : "bg-black border border-black text-white"}`}
      onClick={() => {
        if (isConnected) {
          sendTransaction({
            to: content.toAddress,
            value: parseEther(content.amount),
          });
        } else {
          dispatch(setIsWalletModalOpen(true));
        }
      }}
    >
      {isConnected ? "Sign Transaction" : "Connect Wallet"}
      {isLoading && <Spinner />}
    </button>
  );
};

export default SendToken;
