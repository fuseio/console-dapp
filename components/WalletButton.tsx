import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface WalletButtonProps {
  onClick?: () => void;
  text: string;
  icon: string | StaticImport;
  className?: string;
}

const WalletButton = ({
  onClick,
  text,
  icon,
  className,
}: WalletButtonProps) => {
  return (
    <button
      className="flex flex-col justify-between items-center p-2 border-[#CDD9E5] border rounded-md cursor-pointer hover:bg-[#F2F2F2] transition-all duration-500 h-16"
      onClick={onClick}
    >
      <div className="h-2/3 justify-center items-center flex">
        <Image src={icon} alt="icon" className={className} />
      </div>
      <span className="text-xs font-medium">{text}</span>
    </button>
  );
};

export default WalletButton;
