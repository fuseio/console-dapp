import { useCallback, useMemo, useState } from "react";
import fuseConsoleLogo from "@/assets/fuse-console-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import NavMenu from "./NavMenu";
import NavButton from "./NavButton";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNavbarSlice, setIsWalletModalOpen } from "@/store/navbarSlice";
import { cn, path } from "@/lib/helpers";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

type TopbarProps = {
  className?: string;
}

const Topbar = ({ className }: TopbarProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { isTransfiModalOpen, selected } = useAppSelector(selectNavbarSlice);
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const router = useRouter();

  const handlePointsClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isConnected) {
      router.push(path.AIRDROP_ECOSYSTEM);
    } else {
      dispatch(setIsWalletModalOpen(true));
    }
  }, [dispatch, isConnected, router]);

  const AirdropSubmenu = useMemo(() => [
    {
      title: "Fuse Ember Testnet",
      link: path.AIRDROP_GRANT,
    },
    {
      title: "Points",
      link: "#",
      onClick: handlePointsClick
    },
    {
      title: "Testnet Nodes",
      link: path.TESTNET_NODES,
    },
  ], [handlePointsClick]);

  const menuItems = useMemo(() => [
    {
      title: "Home",
      link: path.HOME,
    },
    {
      title: "Ember",
      link: path.AIRDROP,
      submenu: AirdropSubmenu
    },
    {
      title: "Bridge",
      link: path.BRIDGE,
    },
    {
      title: "Staking",
      link: path.STAKING,
    },
  ], [AirdropSubmenu]);

  return (
    <nav className={cn("w-full h-20 sticky top-0 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-pastel-gray md:border-0",
      isTransfiModalOpen ? "z-0" : "z-40",
      className
    )}>
      <div className="flex justify-between h-full items-center w-8/9 md:w-9/10 max-w-7xl relative">
        <div className="flex items-center gap-10">
          <span>
            <a href={path.HOME}>
              <Image
                src={fuseConsoleLogo}
                alt="fuse console logo"
                width={196}
                height={28}
                className="z-50 md:hidden"
              />
              <Image
                src={fuseLogoMobile}
                alt="fuse logo"
                width={20}
                height={20}
                className="z-50 hidden md:block"
              />
            </a>
          </span>
          <NavMenu menuItems={menuItems} isOpen={isOpen} selected={selected} isResponsive />
        </div>
        <NavButton isOpen={isOpen} setOpen={setOpen} />
      </div>
    </nav>
  );
};

export default Topbar;
