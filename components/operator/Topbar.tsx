import fuseConsoleLogo from "@/assets/fuse-console-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import { useAppDispatch, useAppSelector } from "@/store/store";
import NavMenu from "../NavMenu";
import Button from "../ui/Button";
import { selectOperatorSlice, setIsLogin, setIsOperatorWalletModalOpen } from "@/store/operatorSlice";
import { useRouter } from "next/navigation";
import { setIsWalletModalOpen } from "@/store/navbarSlice";

const menuItems = [
  {
    title: "Console",
    link: "/",
  },
  {
    title: "Operator",
    link: "/operator",
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectOperatorSlice);

  return (
    <nav className="bg-white w-full h-20 sticky top-0 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-gray-alpha-40">
      <div className="flex justify-between h-full items-center w-8/9 md:w-9/10 max-w-7xl relative">
        <span>
          <a href="/">
            <img
              src={fuseConsoleLogo.src}
              alt="fuse console logo"
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
        <Button
          text={isAuthenticated ? "Open Dashboard" : "Account login"}
          className={`${isAuthenticated ? "bg-white text-fuse-black border border-fuse-black" : "bg-fuse-black text-white"} rounded-full font-medium md:text-sm`}
          onClick={() => {
            if (isAuthenticated) {
              return router.push("/dashboard");
            }
            dispatch(setIsOperatorWalletModalOpen(true));
            dispatch(setIsWalletModalOpen(true));
            dispatch(setIsLogin(true));
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
