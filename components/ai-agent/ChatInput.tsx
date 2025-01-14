import { useState, KeyboardEvent } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import send from "@/assets/send.svg";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

type Action = {
  title: string;
  description: string;
};

const actions: Action[] = [
  {
    title: "Balance of address",
    description: "What's the balance of WALLET_ADDRESS?"
  },
  {
    title: "Balance of Agent",
    description: "What's your balance?"
  },
  {
    title: "Block number",
    description: "What's the current block number?"
  },
  {
    title: "Transfer Fuse token to address",
    description: "Transfer AMOUNT to WALLET_ADDRESS"
  },
];

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const [selectedActionIndex, setSelectedActionIndex] = useState(0);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (showActions && filteredActions.length > 0) {
        handleActionSelect(filteredActions[selectedActionIndex]);
      } else {
        handleSend();
      }
    } else if (e.key === "ArrowDown" && showActions) {
      e.preventDefault();
      setSelectedActionIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp" && showActions) {
      e.preventDefault();
      setSelectedActionIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    }
  };

  const handleActionSelect = (action: Action) => {
    if (!action.description) {
      return;
    }
    const slashIndex = message.lastIndexOf('/');
    const newMessage = message.substring(0, slashIndex) + action.description;
    setMessage(newMessage);
    setShowActions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    const slashIndex = inputValue.lastIndexOf('/');
    if (slashIndex !== -1) {
      const query = inputValue.substring(slashIndex + 1).toLowerCase();
      const matches = actions.filter(action => action.title.toLowerCase().includes(query));
      setFilteredActions(matches);
      setShowActions(matches.length > 0);
    } else {
      setShowActions(false);
    }
  };

  return (
    <div className="flex gap-2 items-end p-4 bg-black/90 backdrop-blur-sm bottom-0 left-0 right-0 rounded-[20px] relative">
      <textarea
        className="flex-1 min-h-[48px] max-h-[200px] p-3 rounded-full border-none 
        bg-[#1C1C1C] text-white placeholder-gray-500
        resize-none focus:outline-none outline-none focus:ring-0 ring-0"
        placeholder="Type your message or use / slash command"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        rows={1}
        aria-label="Chat message input"
      />
      {showActions && (
        <div className="absolute bottom-full left-0 bg-white shadow-lg rounded-2xl">
          {filteredActions.map((action, index) => (
            <div
              key={action.title}
              className={`p-4 cursor-pointer rounded-2xl ${index === selectedActionIndex ? 'bg-gray' : ''}`}
              onClick={() => handleActionSelect(action)}
            >
              <strong>{action.title}</strong>
              <p>{action.description}</p>
            </div>
          ))}
        </div>
      )}
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