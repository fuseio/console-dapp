import Image from "next/image";
import React from "react";
import Image from "next/image";

type InfoCardProps = {
  Header: string;
  Body?: string;
  Footer?: string;
  classname?: string;
  type?: 1 | 2 | 3;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  icon?: string;
  onClick?: () => void;
};

const InfoCard = ({
  Header,
  Body = "",
  Footer = "",
  classname = "",
  type = 1,
  size = "small",
  isLoading = false,
  icon,
  onClick,
}: InfoCardProps) => {
  return (
    <div
      className={
        size === "small"
          ? "px-5 py-[17px] w-1/4 bg-white rounded-lg flex flex-col justify-between " +
            classname
          : size === "medium"
          ? "px-5 py-[17px] w-1/2 bg-white rounded-lg flex flex-col justify-between " +
            classname
          : "px-5 py-[17px] w-full bg-white rounded-lg flex flex-col justify-between " +
            classname
      }
    >
      {isLoading ? (
        <div className="py-3 w-2/3 rounded-md bg-black/25 animate-pulse"></div>
      ) : (
        <div className="flex justify-start items-start">
          <div className="text-xl/5 font-black text-black w-[95%]">{Header}</div>
          {icon && (
            <Image
              src={icon}
              alt="icon"
              className="cursor-pointer"
              onClick={onClick}
              width={16}
              height={16}
            />
          )}
        </div>
      )}

      {isLoading ? (
        <div className="py-3 w-1/2 rounded-md bg-black/25 animate-pulse mt-3"></div>
      ) : (
        <div
          className={
            type === 1
              ? "text-sm/4 text-black font-normal opacity-50 mt-3"
              : "text-sm/4 text-black font-normal mt-3"
          }
        >
          {Body}
        </div>
      )}
      {type !== 3 && (
        <div className="text-sm/4 text-black font-normal mt-3">{Footer}</div>
      )}
    </div>
  );
};

export default InfoCard;
