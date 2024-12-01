"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/Card3D";
import { AirdropQuest } from "@/lib/types";
import { useAppDispatch } from "@/store/store";
import { setIsQuestModalOpen, setSelectedQuest } from "@/store/airdropSlice";
import checkmark from "@/assets/checkmark-orange.svg";

type QuestProps = {
  quest: AirdropQuest;
}

function QuestItem({ quest }: QuestProps) {
  const dispatch = useAppDispatch();

  return (
    <CardContainer containerClassName="block p-0 h-full" className="block h-full">
      <CardBody className="bg-white rounded-[20px] w-auto h-full p-8 md:p-6">
        <CardItem
          as="button"
          translateZ="40"
          disabled={quest.completed || quest.comingSoon}
          className="relative flex flex-col justify-between gap-2 w-full min-h-[346px] xl:min-h-[277px]"
          onClick={() => {
            if (quest.completed) {
              return;
            }
            dispatch(setIsQuestModalOpen(true));
            dispatch(setSelectedQuest(quest));
          }}
        >
          {quest.comingSoon && (
            <div className="w-full flex justify-end">
              <CardItem
                as="p"
                translateZ="30"
                className="bg-lightest-gray rounded-full px-5 py-2.5 text-sm leading-none font-semibold"
              >
                Coming soon
              </CardItem>
            </div>
          )}
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
                width={74}
                height={74}
                className="absolute bottom-[10%] right-[20%]"
              />
            }
          </div>
          <div className="flex flex-col gap-3.5">
            <CardItem
              translateZ="50"
              as="p"
              className="text-2xl leading-none font-bold"
            >
              {quest.title}
            </CardItem>
            <div className="flex items-center gap-2">
              <CardItem
                translateZ="50"
                as="p"
                className="text-lg text-bean-red font-bold"
              >
                {quest.point} XP
              </CardItem>
              <CardItem
                translateZ="50"
                className="bg-antique-white rounded-full px-2.5 py-1.5 text-sm leading-none text-bean-red font-semibold"
              >
                {quest.frequency}
              </CardItem>
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default QuestItem;
