import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { useAppDispatch } from "@/store/store";
import { useAccount } from "wagmi";

type CheckConnectionWrapperProps = {
  children: React.ReactNode;
}

const CheckConnectionWrapper = ({ children }: CheckConnectionWrapperProps) => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <button
        className="transition ease-in-out px-4 py-3 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
        onClick={() => dispatch(setIsWalletModalOpen(true))}
      >
        Connect Wallet
      </button>
    );
  }

  return children;
};

export default CheckConnectionWrapper;
