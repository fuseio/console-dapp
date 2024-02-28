import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import checkCircle from "@/assets/check-circle.svg"
import { useAccount } from "wagmi";

interface WalletButtonProps {
  onClick?: () => void;
  text: string;
  icon: string | StaticImport;
  id: string;
  connectingWalletId: string;
  className?: string;
}

const WalletButton = ({
  onClick,
  text,
  icon,
  id,
  connectingWalletId,
  className,
}: WalletButtonProps) => {
  const { connector, isConnected, isConnecting } = useAccount();

  return (
    <button
      className="flex flex-col justify-between items-center relative p-2 border-[#CDD9E5] border rounded-md cursor-pointer hover:bg-[#F2F2F2] disabled:opacity-75 disabled:cursor-default transition-all duration-500 h-[75px]"
      onClick={onClick}
      disabled={isConnected && connector?.id === id}
    >
      {(isConnecting && connectingWalletId === id) &&
        <span className="absolute left-2 top-2 animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>
      }
      {isConnected && connector?.id === id &&
        <Image src={checkCircle} alt="connected" className="absolute left-2 top-2 w-4 h-4" />
      }
      <div className="h-2/3 justify-center items-center flex">
        <Image src={icon} alt="icon" className={className} />
      </div>
      <span className="text-xs font-medium">{text}</span>
    </button>
  );
};

export default WalletButton;
