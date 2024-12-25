"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import back from "@/assets/back.svg";
import { useRouter } from "next/navigation";
import ChatMessage from "@/components/ai-agent/ChatMessage";
import ChatInput from "@/components/ai-agent/ChatInput";
import { sendMessage, TextResponse } from "@/lib/services/aiService";
import { useAccount } from "wagmi";

const Home = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [messages, setMessages] = useState<TextResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    if (address) {
      const savedMessages = localStorage.getItem(`chat_history_${address}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [address]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (address && messages.length > 0) {
      localStorage.setItem(`chat_history_${address}`, JSON.stringify(messages));
    }
  }, [messages, address]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: TextResponse = {
      user: "user",
      text: message
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message);
      setMessages((prev) => [...prev, ...response]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error - show error message to user
      const errorMessage: TextResponse = {
        user: "Fuse Network",
        text: "Sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[30.84px] md:mt-12 md:w-9/10 max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <Button
            text=""
            className="p-2"
            onClick={() => router.back()}
          >
            <Image src={back} alt="back" />
          </Button>
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
        </div>

        <div className="rounded-2xl p-6 h-[600px] my-5 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-6 scroll-smooth">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>👋 Hi! I&apos;m your AI assistant.</p>
                <p>How can I help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))
            )}
            {isLoading && (
              <div className="flex justify-center mt-4">
                <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Home; 