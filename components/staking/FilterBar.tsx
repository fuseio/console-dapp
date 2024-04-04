import React from "react";
import info from "@/assets/info.svg";
import Image from "next/image";

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

const FilterBar = ({
  className = "",
  onClick = (index: number, element: string) => { },
  name,
  states,
  background = [],
  text = [],
  select = 0,
  tooltip = "",
}: FilterBarProps) => {
  const [selected, setSelected] = React.useState(select);
  const handleClick = (i: number) => {
    setSelected(i);
    onClick(i, states[i]);
  };
  return (
    <div
      className={
        "relative flex justify-end items-center md:w-full md:justify-center " + className
      }
    >
      <span className="font-normal text-sm text-text-gray pe-1">
        {name}
      </span>
      <Image
        src={info}
        alt="info"
        className="peer cursor-pointer mb-0.5"
        width={12}
        height={12}
      />
      {tooltip && (
        <div className="hidden absolute top-11 left-0 bg-white rounded-lg shadow-lg w-80 py-2 px-3 md:w-full peer-hover:block text-[10px]/[16px] z-50">
          {tooltip}
        </div>
      )}
      <div className="ms-3 flex w-full max-w-[260px]">
        {states.map((state, index) => {
          if (index === 0) {
            return (
              <div
                key={index}
                style={
                  selected === index
                    ? {
                      background: background[index]
                        ? background[index]
                        : "#E7E7E7",
                      color: text[index] ? text[index] : "#000000",
                    }
                    : {}
                }
                className={
                  selected === index
                    ? "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-dark-gray font-bold rounded-s-full"
                    : "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-white font-bold rounded-s-full"
                }
                onClick={() => handleClick(index)}
              >
                {state}
              </div>
            );
          }
          if (index === states.length - 1) {
            return (
              <div
                key={index}
                style={
                  selected === index
                    ? {
                      background: background[index]
                        ? background[index]
                        : "#E7E7E7",
                      color: text[index] ? text[index] : "#000000",
                    }
                    : {}
                }
                className={
                  selected === index
                    ? "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-dark-gray font-bold rounded-e-full"
                    : "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-white font-bold rounded-e-full"
                }
                onClick={() => handleClick(index)}
              >
                {state}
              </div>
            );
          }
          return (
            <div
              key={index}
              style={
                selected === index
                  ? {
                    background: background[index]
                      ? background[index]
                      : "#E7E7E7",
                    color: text[index] ? text[index] : "#000000",
                  }
                  : {}
              }
              className={
                selected === index
                  ? "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-dark-gray font-bold"
                  : "flex justify-center items-center text-sm text-black cursor-pointer w-[86px] h-[42px] bg-white font-bold"
              }
              onClick={() => handleClick(index)}
            >
              {state}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
