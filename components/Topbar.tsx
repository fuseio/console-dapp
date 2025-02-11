import { useEffect, useState } from "react";
import fuseConsoleLogo from "@/assets/fuse-console-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import NavMenu from "./NavMenu";
import NavButton from "./NavButton";
import { useAppSelector } from "@/store/store";
import { selectNavbarSlice } from "@/store/navbarSlice";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { path } from "@/lib/helpers";
import Image from "next/image";
import { selectAirdropSlice } from "@/store/airdropSlice";

const AirdropSubmenu = [
  {
    title: "Leaderboard",
    link: path.AIRDROP_LEADERBOARD,
  },
  {
    title: "Fuse Ecosystem",
    link: path.AIRDROP_ECOSYSTEM,
  },
]

const Topbar = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { isTransfiModalOpen, selected } = useAppSelector(selectNavbarSlice);
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const [menuItems, setMenuItems] = useState([
    {
      title: "Wallet",
      link: "/wallet",
    },
    {
      title: "Points",
      link: path.AIRDROP,
    },
    {
      title: "Build",
      link: "/build",
    },
    {
      title: "Bridge",
      link: "/bridge",
    },
    {
      title: "Staking",
      link: "/staking",
    },
    {
      title: "Nodes",
      link: path.TESTNET_NODES,
    },
  ]);

  useEffect(() => {
    setMenuItems((oldMenuItems) =>
      oldMenuItems.map((item) => {
        if (item.link === path.BUILD && isAuthenticated) {
          return { ...item, link: path.DASHBOARD }
        }
        if (item.link === path.AIRDROP && airdropSlice.isUser) {
          return { ...item, link: path.AIRDROP, submenu: AirdropSubmenu }
        }
        return item
      }
      )
    );
  }, [isAuthenticated, airdropSlice.isUser]);

  return (
    <nav className={`w-full h-20 sticky top-0 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-pastel-gray md:border-0 ${isTransfiModalOpen ? "z-0" : "z-40"}`}>
      <div className="flex justify-between h-full items-center w-8/9 md:w-9/10 max-w-7xl relative">
        <span>
          <a href="/">
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
        <NavButton isOpen={isOpen} setOpen={setOpen} />
      </div>
    </nav>
  );
};

export default Topbar;
