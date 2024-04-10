import { MenuItems } from "@/lib/types";
import { useAppSelector } from "@/store/store";

import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { path, walletType } from "@/lib/helpers";
import { useAccount } from "wagmi";
import { selectOperatorSlice } from "@/store/operatorSlice";
import Link from "next/link";

type NavMenuProps = {
  menuItems?: MenuItems;
  isOpen?: boolean;
  selected?: string;
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

const NavMenu = ({
  menuItems = [],
  isOpen = false,
  selected = "",
  className = "items-center justify-between w-auto order-1 md:w-full absolute md:translate-y-8 md:top-1/2 md:bg-black left-[50%] -translate-x-[50%] rounded-md",
  liClassName = "w-20"
}: NavMenuProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { address, connector } = useAccount();
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);

  return (
    <>
      {(isOpen || matches) && (
        <div className={className}>
          <ul className="flex flex-row items-center md:items-start gap-2 p-0 md:p-4 mt-0 font-medium text-base/4 md:flex-col">
            {menuItems.map((item, index) => (
              <Link
                href={isAuthenticated && path.BUILD.includes(item.title.toLowerCase()) ? path.DASHBOARD : item.link}
                key={index}
                className={`flex justify-center items-center rounded-full h-9 px-4 hover:bg-lightest-gray md:w-full md:justify-start ${liClassName} ${(item.title.toLowerCase() === selected ? "bg-lightest-gray py-2.5 md:text-white pointer-events-none" : "md:text-gray cursor-pointer group")}`}
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
              >
                <div className="block relative">
                  {item.title}
                </div>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default NavMenu;
