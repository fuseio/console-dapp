import Image from "next/image";
import { useEffect } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Address, parseEther } from "viem";
import { fuse } from "viem/chains";

import { TextResponse } from "@/lib/services/aiService";
import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";

import edisonLogo from "@/assets/edison.png";
import ExternalArrow from "@/assets/ExternalArrow";

type ChatMessageProps = {
  message: TextResponse;
  setMessages: React.Dispatch<React.SetStateAction<TextResponse[]>>
};

type SendTokensContent = {
  amount: string;
  toAddress: Address;
}

const Spinner = () => {
  return (
    <span className="animate-spin border-2 border-gray border-t-2 border-t-dark-gray rounded-full w-4 h-4"></span>
  )
}

const Button = ({ message, setMessages }: ChatMessageProps) => {
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
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastSendTokensIndex = updatedMessages
          .slice()
          .reverse()
          .findIndex((msg) => msg.text === message.text);

        if (lastSendTokensIndex !== -1) {
          const actualIndex = updatedMessages.length - 1 - lastSendTokensIndex;
          updatedMessages[actualIndex] = {
            ...updatedMessages[actualIndex],
            hash,
          };
        }

        return updatedMessages as TextResponse[];
      });
    }
  }, [hash, isConfirmed, message.text, setMessages]);

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
      {message.hash ? "View on Explorer" : isConnected ? "Sign Transaction" : "Connect Wallet"}
      {isLoading && <Spinner />}
      {message.hash && <ExternalArrow />}
    </button>
  );
};

const ChatMessage = ({ message, setMessages }: ChatMessageProps) => {
  const isUser = message.user === "user";
  const isButton = message.action === "SEND_TOKENS";

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <Image src={edisonLogo} alt="AI Assistant" width={50} height={50} />
        </div>
      )}
      <div
        className={`max-w-[85%] p-4 flex flex-col gap-2 ${isUser
          ? "bg-[#E4E4E4] text-black rounded-l-[20px] rounded-br-[20px]"
          : ""
          }`}
      >
        <p className="text-sm">{message.text}</p>
        {isButton && <Button message={message} setMessages={setMessages} />}
      </div>
    </div>
  );
};

export default ChatMessage; 