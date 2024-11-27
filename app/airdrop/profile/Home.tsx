import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Copy from "@/components/ui/Copy";
import { convertTimestampToUTC, eclipseAddress, IS_SERVER, isFloat, path } from "@/lib/helpers";
import { useAppSelector } from "@/store/store";
import { selectAirdropSlice } from "@/store/airdropSlice";
import Avatar from "@/components/ui/Avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/Card3D";
import Quest from "@/components/airdrop/Quest";
import { Quests } from "@/lib/types";

import copyIcon from "@/assets/copy-gray.svg";
import rightCaret from "@/assets/right-caret-black.svg";
import crownCircle from "@/assets/crown-circle.svg";
import questionMark from "@/assets/questionmark-border.svg";
import followX from "@/assets/twitter-x.svg";
import ember from "@/assets/ember.svg";

const Home = () => {
  const { user } = useAppSelector(selectAirdropSlice);

  const [quests] = useState<Quests>([
    {
      id: "followFuseOnTwitter",
      title: "Follow @Fuse_network on X",
      point: "50 points",
      description: "Get 50 point for following an official Fuse Network X account",
      image: followX,
      isActive: true,
      button: "Go to X",
      isFunction: true,
    },
  ])

  function referralLink() {
    const host = !IS_SERVER ? window?.location?.host : ""
    return `${host}?ref=${user.referralCode}`
  }

  return (
    <div className="w-8/9 flex flex-col text-fuse-black my-16 xl:my-14 xl:w-9/12 md:w-9/10 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl xl:text-3xl font-semibold md:max-w-[198px] md:break-all">
          Hey, {eclipseAddress(user.walletAddress)}
        </h1>
      </div>
      <div className="transition-all ease-in-out duration-300 delay-200 flex flex-row lg:flex-col justify-between lg:items-start lg:gap-9 bg-white rounded-[20px] mt-11 mb-[100px] xl:mb-11 px-8 py-6">
        <div className="flex flex-row items-center gap-10">
          <div className="relative">
            <Avatar size={70} />
            <div className="absolute -top-2 -right-2">
              <div className="group relative">
                <Image
                  src={crownCircle}
                  alt="crown circle"
                />
                <div className="tooltip-text hidden absolute translate-x-1/2 -translate-y-1/2 top-[calc(-50%-30px)] right-1/2 bg-white p-6 rounded-2xl w-[250px] xl:w-[200px] shadow-lg group-hover:block text-black text-sm font-medium">
                  <p>
                    You&apos;re an OG! your wallet is more than 1 year old
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-lg leading-none text-pale-slate font-medium">
              Your XP
            </p>
            <div className="flex items-center gap-1.5 mt-6 xl:mt-2 mb-2">
              <p className="text-5xl xl:text-4xl md:text-3xl leading-none font-bold">
                {isFloat(user.points) ? user.points.toFixed(2) : user.points} XP
              </p>
            </div>
            <div className="flex md:flex-col items-center md:items-start gap-2">
              <p className="text-sm text-pale-slate font-medium">
                Last update {convertTimestampToUTC(user.pointsLastUpdatedAt)}
              </p>
              <Image
                src={questionMark}
                alt="question mark"
                width={13}
                height={13}
                className="transition ease-in-out group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </div>
        <div className="lg:flex lg:w-full lg:gap-10">
          <div className="hidden lg:block w-[77px] h-1"></div>
          <div>
            <p className="text-lg xl:text-base leading-none text-pale-slate font-medium">
              Your Rank
            </p>
            <p className="text-5xl xl:text-4xl leading-none font-bold mt-6 xl:mt-2 mb-2 lg:m-0">
              {Intl.NumberFormat('en-US').format(user.leaderboardPosition)}
            </p>
            <Link
              href={path.AIRDROP_LEADERBOARD}
              className="group flex items-center gap-1 text-sm xl:text-xs leading-none text-pale-slate font-medium"
            >
              View Leaderboard
              <Image
                src={rightCaret}
                alt="right caret"
                width={7}
                height={13}
                className="transition ease-in-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
        <div className="lg:flex lg:w-full lg:gap-10">
          <div className="hidden lg:block w-[77px] h-1"></div>
          <div>
            <p className="text-lg xl:text-base leading-none text-pale-slate font-medium">
              Number of referrals
            </p>
            <p className="text-5xl xl:text-4xl leading-none font-bold mt-6 xl:mt-2 mb-2 lg:m-0">
              {Intl.NumberFormat('en-US').format(user.referrals)}
            </p>
            <div className="flex items-center gap-1 text-sm xl:text-xs leading-none text-pale-slate font-medium">
              Qualified users
              <Image
                src={questionMark}
                alt="question mark"
                width={13}
                height={13}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between">
          <p className="text-lg xl:text-base leading-none text-pale-slate font-medium">
            Get FUSE on Flash Testnet
          </p>
          <p className="text-sm leading-none font-medium">
            You can claim your tokens now on faucet!
          </p>
          <a
            href="https://flash-testnet-faucet.eu-north-2.gateway.fm/"
            target="_blank"
            className="transition ease-in-out w-fit bg-black border border-black rounded-full text-white font-semibold text-center px-8 py-2.5 hover:bg-white hover:text-black"
          >
            Go to Faucet
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6">
        <p className="text-3xl font-semibold">
          Start earning points
        </p>
        <div className="transition-all ease-in-out duration-300 delay-200 flex flex-row md:flex-col gap-[30px] xl:gap-5">
          <CardContainer containerClassName="block p-0 w-1/2 md:w-auto min-h-[283px] xl:min-h-56 md:min-h-[430px]" className="block h-full md:min-h-[430px]">
            <CardBody className="bg-white rounded-[20px] flex flex-col justify-between md:justify-start xl:gap-2 md:gap-12 p-10 xl:p-[30px] w-auto h-full md:min-h-[430px] bg-[url('/vectors/globe.svg')] md:bg-[url('/vectors/globe-mobile.svg')] bg-no-repeat bg-right-bottom md:bg-bottom xl:bg-contain">
              <div className="flex flex-col gap-4 xl:gap-3">
                <CardItem
                  as="p"
                  translateZ="50"
                  className="text-2xl xl:text-xl text-primary font-bold"
                >
                  Invite friends
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-lg xl:text-base text-pale-slate font-medium max-w-[243px]"
                >
                  Get 20% of your friend&apos;s total points
                </CardItem>
              </div>
              <div className="flex flex-col gap-2.5 xl:gap-2">
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-sm xl:text-xs text-pale-slate font-medium"
                >
                  Invite link
                </CardItem>
                <div className="flex items-center gap-1.5 xl:gap-1">
                  <CardItem
                    as="p"
                    translateZ="70"
                    className="text-2xl xl:text-xl font-bold md:max-w-[243px]"
                  >
                    {referralLink()}
                  </CardItem>
                  <CardItem translateZ="80">
                    <Copy
                      src={copyIcon}
                      text={referralLink()}
                      tooltipText="Referral link copied"
                      className="transition ease-in-out cursor-pointer hover:opacity-60"
                    />
                  </CardItem>
                </div>
              </div>
              <Image
                src={ember}
                alt="ember"
                width={180}
                height={212}
              />
            </CardBody>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6 mt-24 xl:mt-16">
        <p className="text-3xl font-semibold">
          Follow Fuse on socials
        </p>
        <div className="grid grid-cols-4 xl:grid-cols-3 md:grid-cols-1 auto-rows-min gap-[30px] xl:gap-5">
          {quests.map((quest) => {
            if (quest.id === "walletAge" && !quest.completed) {
              return
            }
            if (quest.isHidden) {
              return
            }
            return (
              <Quest key={quest.title} quest={quest} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home;
