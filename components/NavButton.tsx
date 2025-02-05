import Link from "next/link";

import ConnectWallet from "@/components/ConnectWallet";
import Hamburger from "@/components/ui/Hamburger";
import { selectNavbarSlice } from "@/store/navbarSlice";
import { useAppSelector } from "@/store/store";
import { path } from "@/lib/helpers";

type NavButtonProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const NavButton = ({ isOpen, setOpen }: NavButtonProps) => {
  const { selected } = useAppSelector(selectNavbarSlice);

  return (
    <div className="flex order-2 min-w-[150px] md:w-[93%] justify-end items-center gap-2">
      <Link
        href={path.BUILD}
        className={`flex justify-center items-center rounded-full h-9 px-4 font-medium hover:bg-lightest-gray ${selected === "build" && 'bg-lightest-gray py-2.5 pointer-events-none'}`}
      >
        Build
      </Link>
      <ConnectWallet className="transition ease-in-out hover:bg-success hover:text-black" />
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
