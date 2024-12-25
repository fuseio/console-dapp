import { useState, KeyboardEvent } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import send from "@/assets/send.svg";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end p-4 bg-black/90 backdrop-blur-sm bottom-0 left-0 right-0 rounded-[20px]">
      <textarea
        className="flex-1 min-h-[48px] max-h-[200px] p-3 rounded-full border-none 
        bg-[#1C1C1C] text-white placeholder-gray-500
        resize-none focus:outline-none outline-none focus:ring-0 ring-0"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        rows={1}
        aria-label="Chat message input"
      />
      <Button
        text=""
        className="p-3 bg-gray rounded-full hover:bg-success transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSend}
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Image src={send} alt="" width={20} height={20} />
      </Button>
    </div>
  );
};

export default ChatInput;