import React from "react";
import down from "@/assets/dropdown-down.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

type DropdownProps = {
  className?: string;
  onClick?: (section: number, item: number) => void;
  items: DropdownSectionType[];
  selectedSection: number;
  selectedItem: number;
  isHighlight?: boolean;
  dropdownWidth?: string;
};
type DropdownItemsType = {
  id: number;
  item: string;
  icon: StaticImageData;
};

type DropdownSectionType = {
  heading?: string;
  items: DropdownItemsType[];
};

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
      duration: 0.1,
    },
    y: -100,
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
    },
    y: 0,
  },
};

const Dropdown = ({
  className = "",
  onClick = () => {},
  items,
  selectedSection,
  selectedItem,
  isHighlight = false,
  dropdownWidth = "w-full",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = useOutsideClick(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const highlight = (currentSection: number, currentItem: number) => {
    if (!isHighlight) {
      return false;
    }

    if (!(currentSection === selectedSection && currentItem === selectedItem)) {
      return false;
    }

    return true;
  };

  return (
    <div
      className={
        "flex bg-white p-3 md:p-2 rounded-md cursor-pointer items-center border-border-gray border-[1px] relative text-sm " +
        className
      }
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center w-full md:text-xs">
        <Image
          src={items[selectedSection].items[selectedItem].icon}
          width={32}
          height={32}
          alt={items[selectedSection].items[selectedItem].id.toString()}
          className="h-8 me-2 md:h-6"
        />
        <span className="font-semibold">
          {items[selectedSection].items[selectedItem].item.split(" ")[0]}
        </span>
        <Image src={down} alt="down" className="ml-auto" />
      </div>
      <motion.div
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className={`absolute top-[120%] left-0 bg-white rounded-md shadow-xl pb-3 ${dropdownWidth} z-50 max-h-[360px] overflow-y-auto md:text-xs`}
      >
        {items.map((section, index) => (
          <div className="w-full" key={index}>
            {section.heading && (
              <p className="font-semibold cursor-default px-4 py-3">
                {section.heading}
              </p>
            )}
            {items[index].items.map((item, i) => {
              return (
                <div
                  className={`flex items-center px-4 py-2 md:py-[6px] ${
                    highlight(index, i) ? "bg-modal-bg" : ""
                  }`}
                  onClick={() => {
                    onClick(index, i);
                  }}
                  key={i}
                >
                  <Image
                    src={item.icon}
                    alt={item.id.toString()}
                    width={32}
                    height={32}
                    className="h-8 me-2 md:h-6"
                  />
                  <p className="font-medium cursor-pointer">{item.item}</p>
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dropdown;
