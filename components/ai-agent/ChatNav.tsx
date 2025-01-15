import Link from "next/link";
import { path } from "@/lib/helpers";
import { ChevronDown, LayoutGrid, PlusCircle } from 'lucide-react'

const ChatNav = () => {
  return (
    <div className="h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href={path.AI_AGENT_CHAT} className="flex items-center gap-2 text-sm text-text-dark-gray hover:text-gray">
          <LayoutGrid className="w-4 h-4" />
          History
        </Link>
        <Link href={path.AI_AGENT} className="flex items-center gap-2 text-sm text-text-dark-gray hover:text-gray">
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-40">
          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full text-sm w-full">
            Accept Crypto
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatNav;
