import Link from "next/link";
import { PlusCircle } from 'lucide-react'
import { useAccount } from "wagmi";

import { useAppDispatch } from "@/store/store";
import { path } from "@/lib/helpers";
import { deleteMessages } from "@/store/aiSlice";

const ChatNav = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  return (
    <div className="h-14 flex items-center justify-between">
      <div className="flex items-center gap-8 md:gap-2">
        <Link
          href={path.AI_AGENT}
          className="flex items-center gap-2 text-sm text-text-dark-gray hover:text-gray"
          onClick={() => dispatch(deleteMessages({ address }))}
        >
          <PlusCircle className="w-4 h-4" />
          New Chat
        </Link>
      </div>
    </div>
  )
}

export default ChatNav;
