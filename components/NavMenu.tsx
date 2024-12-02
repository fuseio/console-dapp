import { MenuItems } from "@/lib/types";
import { useAppSelector } from "@/store/store";

import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { walletType } from "@/lib/helpers";
import { useAccount } from "wagmi";
import { selectOperatorSlice } from "@/store/operatorSlice";
import Link from "next/link";

type NavMenuProps = {
  menuItems?: MenuItems;
  isOpen?: boolean;
  selected?: string;
  isResponsive?: boolean;
  className?: string;
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
  isResponsive = false,
  className = `items-center justify-between w-auto order-1 absolute left-[50%] -translate-x-[50%] rounded-md ${isResponsive ? "md:w-full md:translate-y-8 md:top-1/2 md:bg-black" : ""}`,
}: NavMenuProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { address, connector } = useAccount();
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);

  return (
    <>
      {(isOpen || matches) && (
        <div className={className}>
          <ul className={`flex flex-row items-center gap-2 p-0 mt-0 font-medium text-base/4 ${isResponsive ? "md:flex-col md:items-start md:p-4" : ""}`}>
            {menuItems.map((item, index) => (
              <Link
                href={isAuthenticated ? item.authenticatedLink || item.link : item.unauthenticatedLink || item.link}
                key={index}
                className={`flex justify-center items-center rounded-full h-9 px-4 hover:bg-lightest-gray min-w-20 ${isResponsive ? "md:w-full md:justify-start" : ""} ${(item.title.toLowerCase() === selected ? `bg-lightest-gray py-2.5 pointer-events-none ${isResponsive ? "md:text-white" : ""}` : `cursor-pointer group ${isResponsive ? "md:text-gray" : ""}`)}`}
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
                <div className="block relative md:hidden">
                  {item.title}
                </div>
                <div className="hidden relative md:block">
                  {item.title.split(" ")[0]}
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
