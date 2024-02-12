import { MenuItem, MenuItems } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { path, signDataMessage, walletType } from "@/lib/helpers";
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";
import { selectOperatorSlice, setIsContactDetailsModalOpen, setRedirect, validateOperator } from "@/store/operatorSlice";
import { usePathname, useRouter } from "next/navigation";
import { fuse } from "viem/chains";
import Image from "next/image";
import lock from "@/assets/lock.svg";

type NavMenuProps = {
  menuItems?: MenuItems;
  isOpen?: boolean;
  selected?: string;
  className?: string;
  liClassName?: string;
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
  selected = "",
  className = "items-center justify-between w-auto order-1 md:w-full absolute md:translate-y-8 md:top-1/2 md:bg-black left-[50%] -translate-x-[50%] rounded-md",
  liClassName = "w-20"
}: NavMenuProps) => {
  const matches = useMediaQuery("(min-width: 768px)");
  const { address, connector, isConnected } = useAccount();
  const { signature, isAuthenticated, isValidatingOperator, isFetchingOperator } = useAppSelector(selectOperatorSlice);
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
      dispatch(setRedirect(path.BUILD));
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
      item.title.toLowerCase() === "build" &&
      item.title.toLowerCase() !== selected &&
      isConnected &&
      !signature &&
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
          initial={{ opacity: !matches ? 0 : 1 }}
          animate={{ opacity: !matches ? 1 : 1 }}
          exit={{ opacity: !matches ? 0 : 1 }}
        >
          <motion.ul
            className="flex flex-row items-center md:items-start gap-2 p-0 md:p-4 mt-0 font-medium text-base/4 md:flex-col"
            variants={!matches ? animateUL : undefined}
            initial="hidden"
            animate="show"
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                variants={!matches ? animateLI : undefined}
                className={`flex justify-center items-center rounded-full h-9 hover:bg-lightest-gray md:w-full md:justify-start ${liClassName} ${(item.title.toLowerCase() === selected ? "bg-lightest-gray py-2.5 px-4 md:text-white pointer-events-none" : "md:text-gray cursor-pointer group")}`}
                aria-current={
                  item.title.toLowerCase() === selected
                    ? "page"
                    : "false"
                }
                title={isOperatorMenuAndConnected(item) && !loading() ? "Verify your wallet to proceed" : ""}
                onClick={(e) => {
                  amplitude.track(openMenuItemEvent[item.title], {
                    walletType: connector ? walletType[connector.id] : undefined,
                    walletAddress: address
                  });

                  if (item.link !== path.BUILD) {
                    return router.push(item.link);
                  }

                  e.preventDefault();
                  if (pathname === "/dashboard") {
                    router.push(path.BUILD);
                  } else if (isAuthenticated) {
                    router.push("/dashboard");
                  } else if (localStorage.getItem("Fuse-isLoginError")) {
                    localStorage.removeItem("Fuse-isLoginError");
                    dispatch(setIsContactDetailsModalOpen(true));
                  } else if (signature) {
                    router.push(path.BUILD);
                  } else if (isConnected) {
                    if (chain?.id !== fuse.id) {
                      switchNetwork && switchNetwork(fuse.id)
                    }
                    signMessage();
                  } else {
                    router.push(path.BUILD);
                  }
                }}
              >
                <div className="block relative">
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
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMenu;
