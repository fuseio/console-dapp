"use client";

import { useState, KeyboardEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Coins, LinkIcon, DollarSign, ChevronRight } from 'lucide-react'
import * as amplitude from "@amplitude/analytics-browser";

import { useAppDispatch } from "@/store/store";
import { addMessage, sendMessage } from "@/store/aiSlice";
import { path } from "@/lib/helpers";

import edisonWordmark from "@/assets/edison-wordmark.png"

const Home = () => {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isComposing, setIsComposing] = useState(false);
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  const handleSend = (text?: string) => {
    text = text ?? prompt.trim()
    if (!text) return;

    dispatch(addMessage({ message: { user: "user", text }, address }))
    dispatch(sendMessage({ text, address }))
    amplitude.track("Edison Prompt", { promptText: text });
    router.push(path.AI_AGENT_CHAT)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <Image
            src={edisonWordmark}
            alt="Edison Logo"
            width={120}
            height={32}
          />
        </div>

        <h1 className="text-4xl font-semibold mb-4">
          What would you like to do today?
        </h1>
        <p className="text-text-dark-gray max-w-2xl mx-auto">
          Experience the power of blockchain without the complexity. Ask the Fuse
          AI Agent to handle your Fuse Network transactions, manage assets, and
          navigate DeFi services.{" "}
          <Link
            href="https://news.fuse.io/introducing-edison-the-first-ai-payments-agent-on-fuse/"
            target="_blank"
            className="text-black hover:underline inline-flex items-center"
          >
            Learn More <ChevronRight className="w-4 h-4" />
          </Link>
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#49E358]/50 to-[#41008F]/50 rounded-2xl blur-xl" />
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_50px_rgba(74,222,128,0.15)] shadow-green-400/30" />
        <div className="relative bg-fuse-black rounded-2xl p-5">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="What would you like to build? Start typing or choose an example..."
            className="w-full bg-[transparent] text-white placeholder-white/60 resize-none focus:outline-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleSend()}
              className="h-10 px-4 py-2 bg-pale-green hover:bg-[#92DC98] text-sm text-black font-medium rounded-full"
            >
              Start building
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="flex items-center gap-2 h-10 px-4 py-2 bg-lightest-gray hover:bg-selected-gray rounded-[50px] text-sm font-medium"
          onClick={() => handleSend("Buy FUSE token")}
        >
          <Coins className="w-4 h-4" />
          Buy FUSE token
        </button>
        <button
          className="flex items-center gap-2 h-10 px-4 py-2 bg-lightest-gray hover:bg-selected-gray rounded-[50px] text-sm font-medium"
          onClick={() => handleSend("Add Fuse Network to my wallet")}
        >
          <LinkIcon className="w-4 h-4" />
          Add Fuse Network to my wallet
        </button>
        <button
          className="flex items-center gap-2 h-10 px-4 py-2 bg-lightest-gray hover:bg-selected-gray rounded-[50px] text-sm font-medium"
          onClick={() => handleSend("Accept crypto payment right now")}
        >
          <DollarSign className="w-4 h-4" />
          Accept crypto payment right now
        </button>
      </div>
    </main>
  )
}

export default Home;
