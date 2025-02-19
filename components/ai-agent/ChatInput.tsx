import { useState, KeyboardEvent } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { useAccount } from "wagmi";

import { useAppDispatch } from "@/store/store";
import { addMessage, sendMessage } from "@/store/aiSlice";

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
  {
    title: "Create an ERC20 token",
    description: "Create a new ERC20 token with the following details: NAME, SYMBOL, OWNER_ADDRESS",
  },
];

const ChatInput = () => {
  const [prompt, setPrompt] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const [selectedActionIndex, setSelectedActionIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  const handleSend = (text?: string) => {
    text = text ?? prompt.trim()
    if (!text) return;

    dispatch(addMessage({ message: { user: "user", text }, address }))
    dispatch(sendMessage({ text, address }))
    setPrompt("")
  }

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
    const slashIndex = prompt.lastIndexOf('/');
    const newMessage = prompt.substring(0, slashIndex) + action.description;
    setPrompt(newMessage);
    setShowActions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setPrompt(inputValue);

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
    <div className="sticky bottom-0 py-4 mb-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {showActions && (
            <div className="absolute bottom-full left-12 flex flex-col bg-fuse-black text-white shadow-lg rounded-t-2xl">
              {filteredActions.map((action, index) => (
                <button
                  key={action.title}
                  className={`p-4 text-start ${index === 0 ? 'rounded-t-2xl' : ''} ${index === selectedActionIndex ? 'bg-dune' : ''}`}
                  onClick={() => handleActionSelect(action)}
                >
                  {action.title}
                </button>
              ))}
            </div>
          )}
          <div className="relative bg-fuse-black rounded-2xl p-5 flex items-start gap-3">
            <button type="button" className="text-white/60 hover:text-white mt-2">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              placeholder="Type your message or use / slash command"
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              rows={1}
              aria-label="Chat message input"
              className="flex-1 bg-[transparent] text-white placeholder-white/60 resize-none outline-none min-h-[20px] max-h-[200px] py-2"
            />
            <button
              onClick={() => handleSend()}
              disabled={!prompt.trim()}
              aria-label="Send message"
              className="bg-pale-green hover:bg-[#92DC98] text-black rounded-full p-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput;
