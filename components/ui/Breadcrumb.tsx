import React from "react";
import hut from "@/assets/hut.svg";
import right from "@/assets/right.svg";
import rightLight from "@/assets/rightLight.svg";
import { useRouter } from 'next/navigation'

type BreadcrumbProps = {
  className?: string;
  onClick?: (index: number, element: string) => void;
  states: string[];
  links: string[];
};

const Breadcrumb = ({
  className = "",
  onClick = (index: number, element: string) => {},
  states,
  links,
}: BreadcrumbProps) => {
  const router = useRouter()
  return (
    <div className={"flex justify-start items-center md:hidden " + className}>
      <img
        src={hut.src}
        alt="Home"
        className="cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      />
      {states.map((state, index) => {
        if (index < states.length - 1)
          return (
            <span className="flex" key={index}>
              <img src={rightLight.src} alt="Right" className="mx-2" />
              <a
                href={links[index]}
                className="font-medium text-sm hover:underline text-text-inactive"
              >
                {state}
              </a>
            </span>
          );
        else
          return (
            <span className="flex" key={index}>
              <img src={right.src} alt="Right" className="mx-2" />
              <p className="font-medium text-sm ">{state}</p>
            </span>
          );
      })}
    </div>
  );
};

export default Breadcrumb;
