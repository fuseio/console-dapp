import ConnectWallet from "@/components/ConnectWallet";
import Hamburger from "@/components/ui/Hamburger";

type NavButtonProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const NavButton = ({ isOpen, setOpen }: NavButtonProps) => {
  return (
    <div className="flex order-2 min-w-[150px] md:w-[93%] justify-end items-center">
      <ConnectWallet containerClassName="ml-auto" className="transition ease-in-out hover:bg-success hover:text-black" />
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
