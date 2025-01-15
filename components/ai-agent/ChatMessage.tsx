import Image from "next/image";
import { useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Address, parseEther } from "viem";
import { fuse } from "viem/chains";
import { Check, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'

import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { TextResponse } from "@/lib/types";

import ExternalArrow from "@/assets/ExternalArrow";
import edisonGradient from "@/assets/edison-gradient.png"
import { updateMessage } from "@/store/aiSlice";

type ChatMessageProps = {
  message: TextResponse;
};

type SendTokensContent = {
  amount: string;
  toAddress: Address;
}

const AssistantIcon = () => (
  <div className="relative shrink-0 w-[58px] h-[58px] -mt-[10px]">
    <Image
      src={edisonGradient}
      alt="Assistant Icon"
      width={58}
      height={58}
      className="w-[58px] h-[58px]"
    />
  </div>
)

const Spinner = () => {
  return (
    <span className="animate-spin border-2 border-gray border-t-2 border-t-dark-gray rounded-full w-4 h-4"></span>
  )
}

const Button = ({ message }: ChatMessageProps) => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const content = message.content as SendTokensContent;

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
        if (message.hash) {
          window.open(`${fuse.blockExplorers.default.url}/tx/${hash}`, "_blank");
        } else if (isConnected) {
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
      {message.hash && <ExternalArrow />}
    </button>
  );
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.user === "user";
  const isButton = message.action === "SEND_TOKENS";

  return (
    <div className={`flex gap-3 md:gap-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AssistantIcon />}
      <div
        className={`rounded-2xl px-4 py-3 max-w-[85%] ${isUser
          ? 'bg-lightest-gray'
          : 'bg-white border border-lightest-gray'
          } ${!isUser && message.isLoading ? 'message-animate' : ''}`}
      >
        {message.isLoading ? (
          <div className="flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
            {message.hash ? (
              <div className="mt-3 bg-[#ECFCE5] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#49E358] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#198155] font-medium">Transaction complete</span>
                </div>
                <a href={`${fuse.blockExplorers.default.url}/tx/${message.hash}`} className="text-[#198155] hover:underline mt-1 block">
                  View transaction &gt;
                </a>
              </div>
            ) : (
              isButton && <Button message={message} />
            )}
            {!isUser && (
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1 hover:bg-lightest-gray rounded">
                  <Copy className="w-4 h-4 text-text-dark-gray" />
                </button>
                <button className="p-1 hover:bg-lightest-gray rounded">
                  <ThumbsUp className="w-4 h-4 text-text-dark-gray" />
                </button>
                <button className="p-1 hover:bg-lightest-gray rounded">
                  <ThumbsDown className="w-4 h-4 text-text-dark-gray" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
