import { MenuItems } from "@/lib/types";
import { selectNavbarSlice } from "@/store/navbarSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";
import * as amplitude from "@amplitude/analytics-browser";
import { signDataMessage, walletType } from "@/lib/helpers";
import { useAccount, useSignMessage } from "wagmi";
import { selectOperatorSlice, setRedirect, validateOperator } from "@/store/operatorSlice";
import { usePathname, useRouter } from "next/navigation";

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
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { signMessage } = useSignMessage({
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
            variants={animateUL}
            initial="hidden"
            animate="show"
          >
            {menuItems.map((item, index) => (
              <motion.li key={index} variants={animateLI} className="md:w-full">
                <a
                  href={item.link}
                  className={
                    "block p-0 bg-transparent md:py-2 md:pl-3 md:pr-4 " +
                    (item.title.toLowerCase() === navbarSlice.selected
                      ? "bg-lightest-gray py-2.5 px-4 rounded-full md:text-white pointer-events-none"
                      : "md:text-gray pointer-events-auto hover:text-text-darker-gray")
                  }
                  aria-current={
                    item.title.toLowerCase() === navbarSlice.selected
                      ? "page"
                      : "false"
                  }
                  onClick={(e) => {
                    if (item.link === "/operator") {
                      e.preventDefault();
                      if(pathname === "/dashboard") {
                        router.push("/operator");
                        return false;
                      }
                      if (isAuthenticated) {
                        router.push("/dashboard");
                      } else if (isConnected) {
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
