import Image from "next/image";
import * as amplitude from "@amplitude/analytics-browser";

import NavMenu from "../NavMenu";
import { buildSubMenuItems } from "@/lib/helpers";

import contactSupport from "@/assets/contact-support.svg";

type SubMenuProps = {
  selected: string;
}

const SubMenu = ({ selected }: SubMenuProps) => {
  return (
    <div className="flex justify-between items-center">
      <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected={selected} className="md:flex" isResponsive />
      <div className="flex items-center gap-px md:hidden">
        <Image
          src={contactSupport}
          alt="contact support"
        />
        <div className="flex items-center gap-1">
          <p>
            Not sure what&apos;s next?
          </p>
          <button
            className="underline font-bold"
            onClick={() => {
              amplitude.track("Contact us - Operators");
              window.open("https://calendly.com/magali-fuse", "_blank");
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubMenu;
