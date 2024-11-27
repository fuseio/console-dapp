import { MenuItems } from "@/lib/types";
import { useAppSelector } from "@/store/store";

import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { path, walletType } from "@/lib/helpers";
import { useAccount } from "wagmi";
import { selectOperatorSlice } from "@/store/operatorSlice";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import rightCaret from "@/assets/right-caret-black.svg";

type NavMenuProps = {
  menuItems?: MenuItems;
  isOpen?: boolean;
  selected?: string;
  isResponsive?: boolean;
  className?: string;
  liClassName?: string;
};

type OpenMenuItemEvent = {
  [k: string]: string;
}

const openMenuItemEvent: OpenMenuItemEvent = {
  "Staking": "Go to Staking",
  "Bridge": "Go to Bridge"
}

const menu: Variants = {
  closed: (isCenter) => ({
    opacity: 0,
    transition: {
      delay: 0.15,
      duration: 0.3,
    },
    y: -10,
    x: isCenter ? "-50%" : 0,
    transitionEnd: {
      display: "none",
    },
  }),
  open: (isCenter) => ({
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      duration: 0.5,
    },
    y: 0,
    x: isCenter ? "-50%" : 0,
  }),
};

const NavMenu = ({
  menuItems = [],
  isOpen = false,
  selected = "",
  isResponsive = false,
  className = `items-center justify-between w-auto order-1 absolute left-[50%] -translate-x-[50%] rounded-md ${isResponsive ? "md:w-full md:translate-y-8 md:top-1/2 md:bg-black" : ""}`,
  liClassName = "w-fit",
}: NavMenuProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { address, connector } = useAccount();
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);
  const [isHover, setIsHover] = useState(-1);

  return (
    <>
      {(isOpen || matches) && (
        <div className={className}>
          <ul className={`flex flex-row items-center gap-2 p-0 mt-0 font-medium text-base/4 ${isResponsive ? "md:flex-col md:items-start md:p-4" : ""}`}>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative md:w-full"
              >
                <Link
                  href={isAuthenticated && path.BUILD.includes(item.title.toLowerCase()) ? path.DASHBOARD : item.link}
                  className={`group flex justify-center items-center gap-1 rounded-full h-9 px-4 hover:bg-lightest-gray ${isResponsive ? "md:w-full md:justify-start" : ""} ${liClassName} ${(item.title.toLowerCase() === selected ? `bg-lightest-gray py-2.5 cursor-default ${isResponsive ? "md:text-white" : ""}` : `cursor-pointer group ${isResponsive ? "md:text-gray" : ""}`)}`}
                  aria-current={
                    item.title.toLowerCase() === selected
                      ? "page"
                      : "false"
                  }
                  onClick={() => {
                    amplitude.track(openMenuItemEvent[item.title], {
                      walletType: connector ? walletType[connector.id] : undefined,
                      walletAddress: address
                    });
                  }}
                  onMouseEnter={() => setIsHover(index)}
                  onMouseLeave={() => setIsHover(-1)}
                >
                  {item.title}
                  {item.submenu && (
                    <Image
                      src={rightCaret}
                      alt="right caret"
                      width={10}
                      height={10}
                      className="transition-transform duration-300 rotate-90 group-hover:-rotate-90"
                    />
                  )}
                </Link>
                {item.submenu && (
                  <motion.div
                    animate={isHover === index ? "open" : "closed"}
                    initial="closed"
                    exit="closed"
                    variants={menu}
                    className="absolute top-[3rem] bg-white rounded-2xl shadow-xl z-50 font-medium w-52"
                    onMouseEnter={() => setIsHover(index)}
                    onMouseLeave={() => setIsHover(-1)}
                  >
                    <div className="flex flex-col gap-3.5">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          href={subItem.link}
                          key={subIndex}
                          className="text-base/4 text-fuse-black font-medium px-4 py-6 hover:bg-lightest-gray rounded-2xl"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default NavMenu;
