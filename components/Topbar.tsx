import { useState } from "react";
import fuseLogo from "@/assets/fuselogo.svg";
import fuseLogoMobile from "@/assets/logo-mobile.svg";
import NavMenu from "./NavMenu";
import NavButton from "./NavButton";

const menuItems = [
  {
    title: "Console",
    link: "/",
  },
  {
    title: "Staking",
    link: "/staking",
  },
  {
    title: "Bridge",
    link: "/bridge",
  },
];

const Topbar = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <nav className="w-full h-20 sticky top-0 bg-light-gray/60 backdrop-blur-xl flex justify-center py-7 z-40 md:h-[32px] md:mt-2">
      <div className="flex justify-between h-full items-center w-8/9 md:w-9/10 max-w-7xl relative">
        <span>
          <a href="/">
            <img
              src={fuseLogo.src}
              alt="fuse logo"
              className="h-10 md:h-6 z-50 md:hidden"
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
