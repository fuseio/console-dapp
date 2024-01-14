import { useEffect, useState } from "react";
import fuseConsoleLogo from "@/assets/fuse-console-logo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import NavMenu from "./NavMenu";
import NavButton from "./NavButton";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNavbarSlice } from "@/store/navbarSlice";
import { selectOperatorSlice, setRedirect, validateOperator } from "@/store/operatorSlice";
import { hex, signDataMessage } from "@/lib/helpers";
import { useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { isTransfiModalOpen } = useAppSelector(selectNavbarSlice);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
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
  })
  const [menuItems, setMenuItems] = useState([
    {
      title: "Console",
      link: "/",
    },
    {
      title: "Operator",
      link: "/operator",
      callback: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if(operatorSlice.isAuthenticated) {
          router.push("/dashboard");
        } else if(isConnected) {
          signMessage();
        } else {
          router.push("/operator");
        }
      }
    },
    {
      title: "Bridge",
      link: "/bridge",
    },
    {
      title: "Staking",
      link: "/staking",
    },
  ]);

  useEffect(() => {
    setMenuItems((oldMenuItems) =>
      oldMenuItems.map((item) =>
        item.title === "Operator" &&
          operatorSlice.operator.user.smartContractAccountAddress &&
          operatorSlice.operator.user.smartContractAccountAddress !== hex ?
          { ...item, link: "/dashboard" } :
          item
      )
    );
  }, [operatorSlice.operator.user.smartContractAccountAddress]);

  return (
    <nav className={"w-full h-20 sticky top-0 bg-light-gray/60 backdrop-blur-xl flex justify-center py-7 md:h-[32px] md:mt-2 border-b-[0.5px] border-gray-alpha-40" + " " + (isTransfiModalOpen ? "z-0" : "z-40")}>
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
        <NavMenu menuItems={menuItems} isOpen={isOpen} />
        <NavButton isOpen={isOpen} setOpen={setOpen} />
      </div>
    </nav>
  );
};

export default Topbar;
