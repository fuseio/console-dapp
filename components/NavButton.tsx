import Link from "next/link";
import Image from "next/image";
import {useState, useRef, useEffect} from "react";
import {motion} from "framer-motion";
import rightCaret from "@/assets/right-caret-black.svg";

import ConnectWallet from "@/components/ConnectWallet";
import Hamburger from "@/components/ui/Hamburger";
import {selectNavbarSlice} from "@/store/navbarSlice";
import {useAppSelector} from "@/store/store";
import {path} from "@/lib/helpers";
import {useMemo} from "react";

type NavButtonProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const NavButton = ({isOpen, setOpen}: NavButtonProps) => {
  const {selected} = useAppSelector(selectNavbarSlice);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const AirdropSubmenu = useMemo(
    () => [
      {
        title: "Read about Ember",
        link: "https://docs.fuse.io/fuse-ember/about-fuse-ember-l2/",
        target: "_blank",
      },
      {
        title: "Fuse Ember Testnet",
        link: path.AIRDROP_GRANT,
      },
      {
        title: "Testnet Nodes",
        link: path.TESTNET_NODES,
      },
    ],
    []
  );

  const menu = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex order-2 min-w-[150px] md:w-[93%] justify-end items-center gap-2">
      <div
        ref={menuRef}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMenuToggle}
      >
        <div
          className={`flex justify-center items-center rounded-full h-9 px-4 font-medium hover:bg-lightest-gray ${
            selected === "ember" &&
            "bg-lightest-gray py-2.5 pointer-events-none"
          }`}
        >
          Ember
          <Image
            src={rightCaret}
            alt="right caret"
            width={10}
            height={10}
            className="ml-2 transition-transform duration-300 rotate-90 group-hover:-rotate-90"
          />
        </div>

        <motion.div
          animate={isHovered || isMenuOpen ? "open" : "closed"}
          initial="closed"
          variants={menu}
          className="absolute top-[3rem] bg-white rounded-2xl shadow-xl z-50 font-medium w-52"
        >
          <div className="flex flex-col gap-3.5">
            {AirdropSubmenu.map((subItem, subIndex) => (
              <Link
                href={subItem.link}
                target={subItem.target}
                key={subIndex}
                className="text-base/4 text-fuse-black font-medium px-4 py-6 hover:bg-lightest-gray rounded-2xl"
              >
                {subItem.title}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
      <ConnectWallet className="transition ease-in-out hover:bg-success hover:text-black" />
      <button
        type="button"
        className="p-2 w-10 h-8 hidden md:inline-flex focus:outline-none"
        aria-controls="navbar-sticky"
        aria-expanded="false"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="sr-only">Open main menu</span>
        <Hamburger isOpen={isOpen} height={18} strokeWidth={3} />
      </button>
    </div>
  );
};

export default NavButton;
