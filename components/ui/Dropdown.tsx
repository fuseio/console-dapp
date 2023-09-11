import React from "react";
import down from "@/assets/dropdown-down.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { motion } from "framer-motion";

type DropdownProps = {
  className?: string;
  onClick?: (section: number, item: number) => void;
  items: DropdownSectionType[];
  selectedSection: number;
  selectedItem: number;
};
type DropdownItemsType = {
  id: number;
  item: string;
  icon: string;
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
}: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = useOutsideClick(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  return (
    <div
      className={
        "flex bg-white p-3 rounded-md cursor-pointer items-center border-border-gray border-[1px] relative text-sm " +
        className
      }
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center w-full">
        <img
          src={items[selectedSection].items[selectedItem].icon}
          alt={items[selectedSection].items[selectedItem].id.toString()}
          className="h-8 me-2"
        />
        <span className="font-semibold">
          {items[selectedSection].items[selectedItem].item}
        </span>
        <img src={down.src} alt="down" className="ml-auto" />
      </div>
      <motion.div
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
        className="absolute top-[120%] left-0 bg-white rounded-md shadow-xl px-4 pb-3 w-full z-50 max-h-[360px] overflow-y-auto"
      >
        {items.map((section, index) => (
          <div className="w-full" key={index}>
            {section.heading && (
              <p className="font-semibold cursor-default py-3">
                {section.heading}
              </p>
            )}
            {items[index].items.map((item, i) => {
              return (
                <div
                  className="flex items-center py-2"
                  onClick={() => {
                    onClick(index, i);
                  }}
                  key={i}
                >
                  <img
                    src={item.icon}
                    alt={item.id.toString()}
                    className="h-8 me-2"
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
