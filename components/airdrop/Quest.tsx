"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/Card3D";
import { Quest } from "@/lib/types";
import { useAppDispatch } from "@/store/store";
import { setIsQuestModalOpen, setIsWaitlistModalOpen, setSelectedQuest } from "@/store/airdropSlice";
import checkmark from "@/assets/checkmark-orange.svg";
import arrow from "@/assets/arrow-outward.svg";
import arrowGray from "@/assets/arrow-outward-gray.svg";

type QuestProps = {
  quest: Quest;
}

type Quests = {
  [key: string]: {
    onClick: () => void;
  }
}

function QuestItem({ quest }: QuestProps) {
  const dispatch = useAppDispatch();

  const quests: Quests = {
    "joinWaitlist": {
      onClick: () => {
        dispatch(setIsWaitlistModalOpen(true));
      }
    }
  }

  return (
    <CardContainer containerClassName="block p-0 h-full" className="block h-full">
      <CardBody className="bg-white rounded-[20px] w-auto h-full p-8 md:p-6">
        <CardItem
          as="button"
          translateZ="40"
          disabled={quest.completed}
          className="relative flex flex-col justify-between gap-2 w-full min-h-[346px] xl:min-h-[277px]"
          onClick={() => {
            if (quest.completed) {
              return;
            }
            if (quest.isClick) {
              return quests[quest.id].onClick();
            }
            dispatch(setIsQuestModalOpen(true));
            dispatch(setSelectedQuest(quest));
          }}
        >
          <CardItem
            as="p"
            translateZ="30"
            className="border border-black rounded-full px-5 py-2.5 text-sm leading-none font-semibold"
          >
            {quest.frequency}
          </CardItem>
          <div className="relative flex justify-center items-center w-full">
            <CardItem translateZ="40">
              <Image
                src={quest.image}
                alt={quest.title}
              />
            </CardItem>
            {quest.completed &&
              <Image
                src={checkmark}
                alt="checkmark"
                width={50}
                height={50}
                className="absolute -bottom-5 right-[30%]"
              />
            }
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-3.5">
              <CardItem
                translateZ="50"
                as="p"
                className="text-start text-base leading-none font-bold"
              >
                {quest.title}
              </CardItem>
              <CardItem
                translateZ="50"
                as="p"
                className="text-start text-4xl xl:text-lg leading-none font-bold"
              >
                {quest.point} XP
              </CardItem>
            </div>
            <CardItem translateZ="50">
              <Image
                src={quest.completed ? arrowGray : arrow}
                alt="arrow"
                width={25}
                height={25}
              />
            </CardItem>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default QuestItem;
