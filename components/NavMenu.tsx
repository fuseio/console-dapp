import { MenuItem, MenuItems } from "@/lib/types";
import { selectNavbarSlice } from "@/store/navbarSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { signDataMessage, walletType } from "@/lib/helpers";
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import { selectOperatorSlice, setRedirect, validateOperator } from "@/store/operatorSlice";
import { usePathname, useRouter } from "next/navigation";
import { fuse } from "viem/chains";
import Image from "next/image";
import lock from "@/assets/lock.svg";

type NavMenuProps = {
  menuItems?: MenuItems;
  isOpen?: boolean;
  className?: string;
};

const animateUL = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const animateLI = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
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
  className = "items-center justify-between w-auto order-1 md:w-full absolute md:translate-y-8 md:top-1/2 md:bg-black left-[50%] -translate-x-[50%] rounded-md"
}: NavMenuProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const navbarSlice = useAppSelector(selectNavbarSlice);
  const { address, connector, isConnected } = useAccount();
  const { isAuthenticated, isValidatingOperator, isFetchingOperator } = useAppSelector(selectOperatorSlice);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isLoading, signMessage } = useSignMessage({
    message: signDataMessage,
    onSuccess(data) {
      if (!address) {
        return;
      }
      dispatch(setRedirect("/operator"));
      dispatch(validateOperator({
        signData: {
          externallyOwnedAccountAddress: address,
          message: signDataMessage,
          signature: data
        },
      }));
    }
  });

  const isOperatorMenuAndConnected = (item: MenuItem) => {
    if (
      matches &&
      item.title.toLowerCase() === "operator" &&
      pathname !== "/operator" &&
      isConnected &&
      !isAuthenticated
    ) {
      return true;
    }
    return false;
  }

  const loading = () => {
    if (
      isLoading ||
      isValidatingOperator ||
      isFetchingOperator
    ) {
      return true;
    }
    return false;
  }

  return (
    <AnimatePresence>
      {(isOpen || matches) && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.ul
            className="flex flex-row items-center md:items-start p-0 md:p-4 mt-0 font-medium text-base/4 md:flex-col space-x-8 md:space-x-0 rounded"
            variants={!matches ? animateUL : undefined}
            initial="hidden"
            animate="show"
          >
            {menuItems.map((item, index) => (
              <motion.li key={index} variants={!matches ? animateLI : undefined} className="md:w-full">
                <a
                  href={item.link}
                  className={
                    "block relative p-0 bg-transparent md:py-2 md:pl-3 md:pr-4 " +
                    ((item.title.toLowerCase() === navbarSlice.selected || (item.title.toLowerCase() === "operator" && pathname === "/dashboard"))
                      ? "bg-lightest-gray py-2.5 px-4 rounded-full md:text-white pointer-events-none"
                      : "md:text-gray pointer-events-auto group hover:text-text-darker-gray")
                  }
                  aria-current={
                    (item.title.toLowerCase() === navbarSlice.selected || (item.title.toLowerCase() === "operator" && pathname === "/dashboard"))
                      ? "page"
                      : "false"
                  }
                  title="Verify your wallet to proceed"
                  onClick={(e) => {
                    if (item.link === "/operator") {
                      e.preventDefault();
                      if (pathname === "/dashboard") {
                        router.push("/operator");
                        return false;
                      }
                      if (isAuthenticated) {
                        router.push("/dashboard");
                      } else if (isConnected) {
                        if (chain?.id !== fuse.id) {
                          switchNetwork && switchNetwork(fuse.id)
                        }
                        signMessage();
                      } else {
                        router.push("/operator");
                      }
                    } else {
                      amplitude.track(openMenuItemEvent[item.title], {
                        walletType: connector ? walletType[connector.id] : undefined,
                        walletAddress: address
                      });
                    }
                  }}
                >
                  {item.title}
                  {(isOperatorMenuAndConnected(item) && !loading()) &&
                    <Image
                      src={lock}
                      alt="verify your wallet to proceed"
                      width={12}
                      height={12}
                      className="absolute -right-2 -top-3 group-hover:opacity-50"
                    />
                  }
                  {(isOperatorMenuAndConnected(item) && loading()) &&
                    <span className="absolute -right-2 -top-3 animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-3 h-3"></span>
                  }
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMenu;
