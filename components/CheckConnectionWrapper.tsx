import { useAccount } from "wagmi";

import { cn } from "@/lib/helpers";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { useAppDispatch } from "@/store/store";

type CheckConnectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
}

const CheckConnectionWrapper = ({ children, className }: CheckConnectionWrapperProps) => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <button
        className={cn("transition ease-in-out px-4 py-3 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black", className)}
        onClick={() => dispatch(setIsWalletModalOpen(true))}
      >
        Connect Wallet
      </button>
    );
  }

  return children;
};

export default CheckConnectionWrapper;
