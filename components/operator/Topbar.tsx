import fuseConsoleLogo from "@/assets/fuse-console-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import { useAppDispatch } from "@/store/store";
import NavMenu from "../NavMenu";
import Button from "../ui/Button";
import { setIsLoginModalOpen, validateOperator } from "@/store/operatorSlice";
import { useAccount, useSignMessage } from "wagmi";
import { signDataMessage } from "@/lib/helpers";

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

const Topbar = ({
  backgroundColor = "bg-light-gray/60"
}: {
  backgroundColor?: string;
}) => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const { signMessage } = useSignMessage({
    message: signDataMessage,
    onSuccess(data) {
      if(!address) {
        return;
      }
      dispatch(validateOperator({
        signData: {
          externallyOwnedAccountAddress: address,
          message: signDataMessage,
          signature: data
        },
        route: "",
      }));
    }
  });
  
  return (
    <nav className={`w-full h-20 sticky top-0 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-gray-alpha-40 ${backgroundColor}`}>
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
          text={"Operator login"}
          className="bg-fuse-black text-white rounded-full font-medium md:text-sm"
          onClick={() => {
            if(isConnected) {
              return signMessage();
            }
            dispatch(setIsLoginModalOpen(true));
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
