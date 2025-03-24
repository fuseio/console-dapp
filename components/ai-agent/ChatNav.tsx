import Link from "next/link";
import { path } from "@/lib/helpers";
import { PlusCircle } from 'lucide-react'

const ChatNav = () => {
  return (
    <div className="h-14 flex items-center justify-between">
      <div className="flex items-center gap-8 md:gap-2">
        <Link href={path.AI_AGENT} className="flex items-center gap-2 text-sm text-text-dark-gray hover:text-gray">
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Link>
      </div>
    </div>
  )
}

export default ChatNav;
