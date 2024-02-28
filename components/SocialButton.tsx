import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import checkCircle from "@/assets/check-circle.svg"
import { useAccount } from "wagmi";

interface SocialButtonProps {
  onClick?: () => void;
  icon: string | StaticImport;
  id: string;
  connectingWalletId: string;
  className?: string;
}

const SocialButton = ({
  onClick,
  icon,
  id,
  connectingWalletId,
  className
}: SocialButtonProps) => {
  const { connector, isConnected, isConnecting } = useAccount();

  return (
    <button
      className={
        "flex justify-center items-center relative rounded-md cursor-pointer disabled:opacity-75 disabled:cursor-default " +
        className
      }
      onClick={onClick}
      disabled={isConnected && connector?.id === id}
    >
      {(isConnecting && connectingWalletId === id) &&
        <span className="absolute left-2 top-2 animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>
      }
      {isConnected && connector?.id === id &&
        <Image src={checkCircle} alt="connected" className="absolute left-2 top-2 w-4 h-4" />
      }
      <Image src={icon} alt="icon" className="max-w-[35px] max-h-[35px]" />
    </button>
  );
};

export default SocialButton;
