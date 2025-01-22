"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/Card3D";
import { AirdropQuest } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice, setIsClaimTestnetFuseModalOpen, setIsQuestModalOpen, setIsWaitlistModalOpen, setSelectedQuest } from "@/store/airdropSlice";
import checkBackground from "@/assets/check-background-black.svg";
import pointHexagon from "@/assets/fuse-foundation-point-hexagon.svg";
import { isSocialFollowed } from "@/lib/helpers";
import pointHexagonYellow from "@/assets/point-hexagon-yellow.svg";

type QuestProps = {
  quest: AirdropQuest;
}

type Custom = {
  [key: string]: { onClick: () => void };
}

function QuestItem({ quest }: QuestProps) {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const isSocial = quest.id === "followFuseOnTwitter" || isSocialFollowed(airdropSlice.user);

  const custom: Custom = {
    "joinWaitlist": {
      onClick: () => {
        dispatch(setIsWaitlistModalOpen(true));
      }
    },
    "emberFaucet": {
      onClick: () => {
        dispatch(setIsClaimTestnetFuseModalOpen(true));
      }
    }
  }

  return (
    <CardContainer containerClassName="block p-0 h-full" className="block h-full">
      <CardBody className={`bg-white rounded-[20px] w-auto h-full py-8 pl-8 pr-6 md:p-6 ${isSocial ? "" : "grayscale"}`}>
        <CardItem
          as="button"
          translateZ="40"
          disabled={quest.completed || quest.comingSoon || !isSocial}
          className={`relative flex flex-col gap-2 w-full h-[inherit] min-h-[346px] xl:min-h-[277px] ${quest.comingSoon ? "justify-between" : "justify-end"}`}
          onClick={() => {
            if (quest.completed) {
              return;
            }
            if (quest.isCustom) {
              return custom[quest.id].onClick();
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
                className="bg-dune rounded-full px-5 py-2.5 text-sm leading-none text-white font-semibold"
              >
                Coming soon
              </CardItem>
            </div>
          )}
          {quest.completed &&
            <CardItem translateZ="100" className="w-full flex justify-end">
              <div className="group relative cursor-pointer flex justify-center items-center">
                <Image
                  src={checkBackground}
                  alt="check"
                  width={38}
                  height={38}
                />
                <div className="tooltip-text-black hidden bottom-16 absolute bg-black p-4 rounded-2xl w-[130px] shadow-lg group-hover:block text-white text-sm font-medium">
                  <p>
                    Task complete
                  </p>
                </div>
              </div>
            </CardItem>
          }
          <CardItem translateZ="40" className="w-full flex justify-center items-center">
            <Image
              src={quest.image}
              alt={quest.title}
            />
          </CardItem>
          <div className="flex flex-col gap-3.5">
            <CardItem
              translateZ="50"
              as="p"
              className="text-start text-2xl leading-none font-semibold"
            >
              {quest.title}
            </CardItem>
            <div className="flex items-center gap-2">
              <CardItem
                translateZ="50"
                className="flex items-end gap-1"
              >
                <Image
                  src={quest.frequency === "One-time" ? pointHexagon : pointHexagonYellow}
                  alt="point hexagon"
                  width={18}
                  height={22}
                />
                <p className={`text-start text-lg leading-none font-bold ${quest.frequency === "One-time" ? "text-stoplight-go-green" : "text-sand"}`}>
                  {quest.point}
                </p>
              </CardItem>
              {quest.frequency && (
                <CardItem
                  translateZ="50"
                  className="bg-modal-bg rounded-full px-2.5 py-1.5 text-sm leading-none text-text-dark-gray font-semibold"
                >
                  {quest.frequency}
                </CardItem>
              )}
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default QuestItem;
