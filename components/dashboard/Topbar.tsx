import fuseOperatorLogo from "@/assets/fuse-operator-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import NavMenu from "../NavMenu";
import ConnectWallet from "../ConnectWallet";
import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { hex } from "@/lib/helpers";

const menuItems = [
  {
    title: "Operator",
    link: "/operator",
  },
  {
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    title: "Bridge",
    link: "/bridge",
  },
  {
    title: "Staking",
    link: "/staking",
  },
];

const Topbar = () => {
  const operatorSlice = useAppSelector(selectOperatorSlice);

  return (
    <nav className="w-full h-20 sticky top-0 bg-light-gray/60 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-gray-alpha-40">
      <div className="flex justify-between h-full items-center w-8/9 md:w-9/10 max-w-7xl relative">
        <span>
          <a href="/">
            <img
              src={fuseOperatorLogo.src}
              alt="fuse operator logo"
              className="h-6 z-50 md:hidden"
            />
            <img
              src={fuseLogoMobile.src}
              alt="fuse logo"
              className="h-5 z-50 hidden md:block"
            />
          </a>
        </span>
        <NavMenu menuItems={menuItems} />
        <ConnectWallet disableSwitchChain={operatorSlice.operator.user.smartContractAccountAddress !== hex} />
      </div>
    </nav>
  );
};

export default Topbar;
