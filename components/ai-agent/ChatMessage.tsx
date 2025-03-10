import Image from "next/image";
import { createElement } from "react";
import { fuse } from "viem/chains";
import { Check, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'

import { ChatMessageProps } from "@/lib/types";
import CreateOperatorAccount from "./actions/CreateOperatorAccount";
import SendToken from "./actions/SendToken";
import BuyFuseToken from "./actions/BuyFuseToken";
import AddFuseNetwork from "./actions/AddFuseNetwork";
import CheckConnectionWrapper from "../CheckConnectionWrapper";
import AcceptCryptoPayment from "./actions/AcceptCryptoPayment";

import edisonGradient from "@/assets/edison-gradient.png"

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

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.user === "user";
  const actionComponents: Record<string, React.ComponentType<ChatMessageProps>> = {
    "SEND_TOKENS": SendToken,
    "CREATE_OPERATOR_ACCOUNT": CreateOperatorAccount,
    "BUY_FUSE_TOKEN": BuyFuseToken,
    "ADD_FUSE_NETWORK": () => CheckConnectionWrapper({ children: <AddFuseNetwork /> }),
    "ACCEPT_CRYPTO_PAYMENT": AcceptCryptoPayment,
  };

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
            ) : (message.action && actionComponents[message.action]) ? (
              createElement(actionComponents[message.action], { message })
            ) : null}
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
