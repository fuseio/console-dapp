import React from "react";
import Image from "next/image";
import info from "@/assets/info.svg";

type FilterBarProps = {
  className?: string;
  onClick?: (index: number, element: string) => void;
  name: string;
  states: string[];
  background?: string[];
  text?: string[];
  select?: number;
  tooltip?: string;
};

const FilterBar: React.FC<FilterBarProps> = ({
  className = "",
  onClick = () => {},
  name,
  states,
  background = [],
  text = [],
  select = 0,
  tooltip = "",
}) => {
  const [selected, setSelected] = React.useState(select);

  const handleClick = (index: number) => {
    setSelected(index);
    onClick(index, states[index]);
  };

  const getButtonStyle = (index: number) => ({
    background: selected === index ? background[index] || "#E7E7E7" : "",
    color: selected === index ? text[index] || "#000000" : "",
  });

  const getButtonClass = (index: number) => {
    const baseClass = "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] font-bold";
    const selectedClass = selected === index ? "bg-dark-gray" : "bg-white";
    const roundedClass = index === 0 ? "rounded-s-full" : index === states.length - 1 ? "rounded-e-full" : "";
    return `${baseClass} ${selectedClass} ${roundedClass}`;
  };

  return (
    <div className={`relative flex justify-end items-center md:w-full md:justify-center ${className}`}>
      <span className="font-normal text-sm text-text-gray pe-1">{name}</span>
      <Image src={info} alt="info" className="peer cursor-pointer mb-0.5" width={12} height={12} />
      {tooltip && (
        <div className="hidden absolute top-11 left-0 bg-white rounded-lg shadow-lg w-80 py-2 px-3 md:w-full peer-hover:block text-[10px]/[16px] z-50">
          {tooltip}
        </div>
      )}
      <div className="ms-3 flex w-full max-w-[260px]">
        {states.map((state, index) => (
          <div
            key={index}
            style={getButtonStyle(index)}
            className={getButtonClass(index)}
            onClick={() => handleClick(index)}
          >
            {state}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
