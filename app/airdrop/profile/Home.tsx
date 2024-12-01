import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Copy from "@/components/ui/Copy";
import { convertTimestampToUTC, eclipseAddress, IS_SERVER, isFloat, path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { retrieveAirdropUser, selectAirdropSlice } from "@/store/airdropSlice";
import Avatar from "@/components/ui/Avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/Card3D";
import Quest from "@/components/airdrop/Quest";
import { AirdropQuests } from "@/lib/types";

import copyIcon from "@/assets/copy-gray.svg";
import rightCaret from "@/assets/right-caret-black.svg";
import questionMark from "@/assets/questionmark-border.svg";
import fire from "@/assets/fire.svg";
import ember from "@/assets/ember.svg";
import friends from "@/assets/friends.svg";
import flashFaucet from "@/assets/flash-faucet.svg";
import followX from "@/assets/twitter-x.svg";
import joinWaitlist from "@/assets/join-waitlist.svg";
import fuseFaucet from "@/assets/fuse-faucet.svg";
import rouletteGame from "@/assets/roulette-game.svg";
import verifyDiscord from "@/assets/verify-discord.svg";
import joinTelegram from "@/assets/join-telegram.svg";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user, twitterAuthUrl } = useAppSelector(selectAirdropSlice);
  const router = useRouter();
  const searchParams = useSearchParams();
  const twitterConnected = searchParams.get('twitter-connected');

  const [quests, setQuests] = useState<AirdropQuests>([
    {
      id: "followFuseOnTwitter",
      title: "Follow on X",
      description: "Get 50 point for following an official Fuse Network X account",
      point: 50,
      frequency: "One-time",
      image: followX,
      buttons: [
        {
          text: "Go to X",
          isFunction: true,
        }
      ]
    },
    {
      id: "joinFuseDiscord",
      title: "Verify on Discord",
      description: "Get 50 point for joining an official Fuse network Discord channel  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 50,
      frequency: "One-time",
      image: verifyDiscord,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/join-fuse-discord",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "join-fuse-discord",
        }
      ]
    },
    {
      id: "telegramSubscription",
      title: "Join Fuse Telegram",
      description: "Get 50 point for joining an official Fuse Network Telegram channel  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 50,
      frequency: "One-time",
      image: joinTelegram,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/join-fuse-telegram",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "telegram",
        }
      ]
    },
    {
      id: "joinWaitlist",
      title: "Join Waitlist",
      point: 100,
      frequency: "One-time",
      image: joinWaitlist,
      comingSoon: true,
    },
    {
      id: "claimFuseOnFaucet",
      title: "Claim FUSE on faucet",
      point: 50,
      frequency: "One-time",
      image: fuseFaucet,
      comingSoon: true,
    },
    {
      id: "rouletteGame",
      title: "Roulette game",
      point: 20,
      frequency: "Up to 10 times a day",
      image: rouletteGame,
      comingSoon: true,
    },
  ])

  function referralLink() {
    const host = !IS_SERVER ? window?.location?.host : ""
    return `${host}/airdrop?ref=${user.referralCode}`
  }

  useEffect(() => {
    setQuests((prevQuests) => {
      const newQuests = [...prevQuests];
      newQuests.map((newQuest) => {
        user.completedQuests?.map((completedQuest) => {
          let completedQuestId = completedQuest.type;
          if (completedQuest.stakingType) {
            completedQuestId = `${completedQuest.type}-${completedQuest.stakingType}`;
          }
          if (newQuest.id === completedQuestId) {
            newQuest.completed = true;
          }
        })
        return newQuest;
      });
      return newQuests;
    })
  }, [user.completedQuests])

  useEffect(() => {
    if (twitterConnected === "true") {
      dispatch(retrieveAirdropUser());
    }
  }, [dispatch, router, twitterConnected])

  useEffect(() => {
    if (twitterAuthUrl) {
      router.push(twitterAuthUrl);
    }
  }, [router, twitterAuthUrl])

  return (
    <div className="w-8/9 flex flex-col text-fuse-black my-16 xl:my-14 xl:w-9/12 md:w-9/10 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl xl:text-3xl font-semibold">
          Hey, {eclipseAddress(user.walletAddress)}
        </h1>
      </div>
      <div className="relative bg-lightest-gray rounded-[20px] mt-11 mb-[100px] xl:mb-11 p-8">
        <div className="flex flex-wrap justify-between gap-6 max-w-3xl xl:max-w-none">
          <div className="flex flex-row items-center gap-6">
            <div>
              <Avatar size={80} />
            </div>
            <div className="md:shrink">
              <p className="text-lg leading-none text-text-dark-gray font-medium">
                My Ember Points
              </p>
              <div className="flex items-center gap-1.5 mt-6 xl:mt-2 mb-2">
                <Image
                  src={fire}
                  alt="fire"
                  width={26}
                  height={32}
                />
                <p className="text-5xl xl:text-4xl md:text-3xl leading-none font-bold">
                  {isFloat(user.points) ? user.points.toFixed(2) : user.points}
                </p>
              </div>
              {user.pointsLastUpdatedAt ? (
                <div className="flex md:flex-col items-center md:items-start gap-2">
                  <p className="text-sm text-text-dark-gray font-medium">
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
              ) : <div></div>}
            </div>
          </div>
          <div>
            <p className="text-lg xl:text-base leading-none text-text-dark-gray font-medium">
              Your Rank
            </p>
            <p className="text-5xl xl:text-4xl leading-none font-bold mt-6 xl:mt-2 mb-2 lg:m-0">
              {Intl.NumberFormat('en-US').format(user.leaderboardPosition)}
            </p>
            <Link
              href={path.AIRDROP_LEADERBOARD}
              className="group flex items-center gap-1 text-sm xl:text-xs leading-none text-text-dark-gray font-medium"
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
          <div>
            <p className="text-lg xl:text-base leading-none text-text-dark-gray font-medium">
              Number of referrals
            </p>
            <p className="text-5xl xl:text-4xl leading-none font-bold mt-6 xl:mt-2 mb-2 lg:m-0">
              {user.referrals ? Intl.NumberFormat('en-US').format(user.referrals) : 0}
            </p>
            <div></div>
          </div>
        </div>
        <Image
          src={ember}
          alt="ember"
          width={220}
          height={250}
          className="absolute -top-1/2 right-5 xl:hidden"
        />
      </div>
      <div className="flex flex-col gap-8 xl:gap-6">
        <h2 className="text-3xl font-semibold">
          Get started
        </h2>
        <div className="flex flex md:flex-col gap-8 xl:gap-5">
          <CardContainer containerClassName="block p-0 w-full min-h-[283px] xl:min-h-56 md:min-h-[430px]" className="block h-full md:min-h-[430px]">
            <CardBody className="bg-fuse-black text-white rounded-[20px] flex md:flex-col justify-between w-auto h-full md:min-h-[430px]">
              <div className="flex flex-col justify-between gap-4 py-10 pl-10 xl:py-[30px] xl:pl-[30px] md:px-6 md:pt-6 md:pb-0">
                <div className="flex flex-col gap-4">
                  <CardItem
                    as="h3"
                    translateZ="70"
                    className="text-2xl leading-none font-bold"
                  >
                    Get FUSE on Flash Testnet
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="90"
                    className="text-lg leading-none text-ash-gray font-medium max-w-[22rem]"
                  >
                    Get some $FUSE from our faucet. you can request 210 per week.
                  </CardItem>
                </div>
                <CardItem
                  translateZ="30"
                  href="https://faucet.flash.fuse.io/"
                  target="_blank"
                  className="transition ease-in-out w-fit bg-white border border-white rounded-full text-black font-semibold text-center px-10 py-4 hover:bg-black hover:text-white"
                  as="a"
                >
                  Claim $FUSE
                </CardItem>
              </div>
              <div className="flex justify-center items-end md:justify-end pb-10 xl:pb-[30px] md:pb-6">
                <Image
                  src={flashFaucet}
                  alt="flash faucet"
                  width={180}
                  height={140}
                />
              </div>
            </CardBody>
          </CardContainer>
          <CardContainer containerClassName="block p-0 w-full min-h-[283px] xl:min-h-56 md:min-h-[430px]" className="block h-full md:min-h-[430px]">
            <CardBody className="bg-white rounded-[20px] flex md:flex-col justify-between w-auto h-full md:min-h-[430px]">
              <div className="flex flex-col justify-between gap-4 py-10 pl-10 xl:py-[30px] xl:pl-[30px] md:px-6 md:pt-6 md:pb-0">
                <div className="flex flex-col gap-4">
                  <CardItem
                    as="h3"
                    translateZ="70"
                    className="text-2xl leading-none font-bold"
                  >
                    Invite friends
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="90"
                    className="text-lg leading-none text-text-dark-gray font-medium max-w-[22rem]"
                  >
                    Receive 100XP for each referral who made min 10 interactions with quests. Also receive 15% of your referrals points
                  </CardItem>
                </div>
                <div className="flex flex-col gap-2.5 xl:gap-2">
                  <CardItem
                    as="p"
                    translateZ="110"
                    className="text-sm xl:text-xs text-text-dark-gray font-medium"
                  >
                    Invite link
                  </CardItem>
                  <div className="flex items-center gap-1.5 xl:gap-1">
                    <CardItem
                      as="p"
                      translateZ="70"
                      className="text-[1.25rem] xl:text-xl font-bold md:max-w-[243px]"
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
              </div>
              <div className="flex justify-center items-end md:justify-end pb-10 xl:pb-[30px] md:pb-6">
                <Image
                  src={friends}
                  alt="friends"
                  width={160}
                  height={120}
                />
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6 mt-24 xl:mt-16">
        <h2 className="text-3xl font-semibold">
          Earn ember points
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-1 auto-rows-min gap-[30px] xl:gap-5">
          {quests.map((quest) => (
            <Quest key={quest.title} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
