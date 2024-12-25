import Image from "next/image";
import edisonLogo from "@/assets/edison.png";
import { TextResponse } from "@/lib/services/aiService";

type ChatMessageProps = {
  message: TextResponse;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.user === "Fuse Network";

  return (
    <div className={`flex gap-3 mb-4 ${isAssistant ? "" : "justify-end"}`}>
      {isAssistant && (
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <Image src={edisonLogo} alt="AI Assistant" width={50} height={50} />
        </div>
      )}
      <div
        className={`max-w-[85%] p-4 ${isAssistant
            ? ""
            : "bg-[#E4E4E4] text-black rounded-l-[20px] rounded-br-[20px]"
          }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage; 