"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/Card3D";
import { Quest } from "@/lib/types";
import pointHexagon from "@/assets/point-hexagon.svg";
import hourglass from "@/assets/hourglass.svg";
import { useAppDispatch } from "@/store/store";
import { setIsQuestModalOpen, setSelectedQuest } from "@/store/airdropSlice";
import checkBackground from "@/assets/check-background.svg";

type QuestProps = {
  quest: Quest;
}

function QuestItem({ quest }: QuestProps) {
  const dispatch = useAppDispatch();

  return (
    <CardContainer containerClassName="block p-0 h-full" className="block h-full">
      <CardBody className="bg-oslo-gray/[.22] rounded-[20px] w-auto h-full">
        <CardItem
          as="button"
          translateZ="40"
          disabled={!quest.isActive || quest.completed}
          className={`relative flex flex-col justify-between gap-2 w-full min-h-[346px] xl:min-h-[277px] md:p-[30px] ${quest.padding ?? "p-6"}`}
          onClick={() => {
            if (!quest.isActive || quest.completed) {
              return;
            }
            dispatch(setIsQuestModalOpen(true));
            dispatch(setSelectedQuest(quest));
          }}
        >
          {quest.image &&
            <div className="flex justify-center items-center w-full min-h-[260px] xl:min-h-[208px]">
              <CardItem translateZ="40">
                <Image
                  src={quest.image}
                  alt={quest.title}
                />
              </CardItem>
            </div>
          }
          {quest.completed &&
            <CardItem translateZ="100" className="absolute top-[22px] right-5">
              <div className="group relative cursor-pointer flex justify-center items-center">
                <Image
                  src={checkBackground}
                  alt="check"
                  width={38}
                  height={38}
                />
                <div className="tooltip-text hidden bottom-16 absolute bg-white p-4 rounded-2xl w-[130px] shadow-lg group-hover:block text-black text-sm font-medium">
                  <p>
                    Task complete
                  </p>
                </div>
              </div>
            </CardItem>
          }
          <div className="flex flex-col gap-3.5">
            <CardItem
              translateZ="50"
              as="p"
              className="text-start text-lg xl:text-base md:text-2xl leading-none text-white font-bold"
            >
              {quest.title}
            </CardItem>
            <div className="flex items-center gap-1">
              <CardItem
                translateZ="30"
                className="mb-0.5"
              >
                <Image
                  src={quest.isActive ? pointHexagon : hourglass}
                  alt={quest.isActive ? "point hexagon" : "hourglass"}
                  width={12}
                  height={14}
                />
              </CardItem>
              <CardItem
                translateZ="20"
                as="p"
                className={`text-left text-lg xl:text-base md:text-2xl leading-none ${quest.isActive ? "text-success" : "text-white/50"}`}
              >
                {quest.isActive ? quest.point : "Coming Soon"}
              </CardItem>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default QuestItem;
