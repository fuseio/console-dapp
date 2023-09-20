import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

interface SocialButtonProps {
  onClick?: () => void;
  icon: string | StaticImport;
  className?: string;
}

const SocialButton = ({ onClick, icon, className }: SocialButtonProps) => {
  return (
    <button
      className={
        "flex justify-center items-center rounded-md cursor-pointer h-10 " +
        className
      }
      onClick={onClick}
    >
      <Image src={icon} alt="icon" className="max-w-[35px] max-h-[35px]" />
    </button>
  );
};

export default SocialButton;
