import ConnectWallet from "@/components/ConnectWallet";
import Hamburger from "@/components/ui/Hamburger";
import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { usePathname } from "next/navigation";
import { path } from "@/lib/helpers";

type NavButtonProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const NavButton = ({ isOpen, setOpen }: NavButtonProps) => {
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);
  const pathname = usePathname();

  return (
    <div className="flex order-2 min-w-[150px] md:w-[93%] justify-end items-center">
      <ConnectWallet containerClassName="ml-auto" disableSwitchChain={isAuthenticated && pathname === path.DASHBOARD} />
      <button
        type="button"
        className="p-2 w-10 h-8 hidden md:inline-flex focus:outline-none"
        aria-controls="navbar-sticky"
        aria-expanded="false"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="sr-only">Open main menu</span>
        <Hamburger
          isOpen={isOpen}
          height={18}
          strokeWidth={3}
        />
      </button>
    </div>
  )
}

export default NavButton;
