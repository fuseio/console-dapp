import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import Copy from "@/components/ui/Copy";
import { convertTimestampToUTC, IS_SERVER, isFloat, isTwitterFollowed, path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice, setIsClaimTestnetFuseModalOpen, setIsQuestModalOpen, setSelectedQuest } from "@/store/airdropSlice";
import Avatar from "@/components/ui/Avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/Card3D";
import Quest from "@/components/airdrop/Quest";
import { AirdropQuests } from "@/lib/types";

import copyIcon from "@/assets/copy-gray.svg";
import rightCaret from "@/assets/right-caret.svg";
import rightCaretBlack from "@/assets/right-caret-black.svg";
import questionMark from "@/assets/questionmark-border.svg";
import pointHexagon from "@/assets/fuse-foundation-point-hexagon.svg";
import fuseAirdropPhase from "@/assets/fuse-foundation.svg";
import bridgeFuse from "@/assets/bridge-fuse.svg";
import followX from "@/assets/twitter-x-green.svg";
import verifyDiscord from "@/assets/verify-discord-green.svg";
import joinTelegram from "@/assets/join-telegram-green.svg";
import volt from "@/assets/volt-wallet-green.svg";
import artrific from "@/assets/artrific-green.svg";
import meridian from "@/assets/meridian-green.svg";
import voltageLiquidity from "@/assets/voltage-liquidity.svg";
import gooddollar from "@/assets/gooddollar-green.svg";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user, twitterAuthUrl } = useAppSelector(selectAirdropSlice);
  const router = useRouter();
  const searchParams = useSearchParams();
  const twitterConnected = searchParams.get('twitter-connected');

  const [quests, setQuests] = useState<AirdropQuests>([
    {
      id: "followFuseOnTwitter",
      title: "Follow @Fuse_network on X",
      description: "Get 50 point for following an official Fuse Network X account",
      point: "50 Points",
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
      id: "telegramSubscription",
      title: "Join Fuse Telegram",
      description: "Get 50 point for joining an official Fuse Network Telegram channel  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: "50 Points",
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
        }
      ]
    },
    {
      id: "joinFuseDiscord",
      title: "Join Fuse Discord",
      description: "Get 50 point for joining an official Fuse network Discord channel  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: "50 Points",
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
        }
      ]
    },
    {
      id: "exploreVoltageDex",
      title: "Explore Voltage Finance",
      description: "Trade, invest, and earn with just a few clicks.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: "125 Points",
      frequency: "One-time",
      image: volt,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/voltage-on-fuse-network",
        },
        {
          text: "Verify Quest",
          isFunction: true,
        }
      ]
    },
    {
      id: "liquidityVoltage",
      title: "Provide Liquidity to Voltage v3",
      description: "To multiply you points you need to take 2 simple steps:  \n**Step 1**\nBridge funds to the Fuse Network using Fuse bridge = 4 points per $1, available once per day.  \n**Step 2**\nDouble your points by putting bridged funds in any V3 liquidity pool on Voltage DEX = 8 points per $1 of the bridged funds, available once per day.",
      point: "8 points per $1 in pool daily",
      image: voltageLiquidity,
      buttons: [
        {
          text: "Go to Voltage",
          link: "https://voltage.finance/pool?filter=v3",
        },
      ]
    },
    {
      id: "stakeOnVoltage",
      title: "Stake on Voltage",
      description: "To multiply you points you need to take 2 simple steps:  \n**Step 1**\nBridge funds to the Fuse Network using Fuse bridge = 4 points per $1, available once per day.  \n**Step 2**\nDouble your points by staking any of the four tokens on Voltage DEX = 8 points per $1 of the bridged funds, available once per day.",
      point: "8 points per $1 staked daily",
      image: volt,
      buttons: [
        {
          text: "Go to Voltage",
          link: "https://app.voltage.finance/stake",
        },
      ]
    },
    {
      id: "exploreVoltWallet",
      title: "Install the Volt wallet",
      description: "The Volt wallet is the best mobile solution for interacting with the Fuse network, as it is built and developed by the Fuse team. Explore its features and get 200 points.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: "200 Points",
      frequency: "One-time",
      image: volt,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/explore-volt-wallet",
        },
        {
          text: "Verify Quest",
          isFunction: true,
        }
      ]
    },
    {
      id: "provideMeridianLiquidity",
      title: "Lend on Meridian",
      description: "Lend on Meridian & Multiply your points easily with these quick steps  \n**Step 1**\nBridge funds to Fuse Network using the Fuse bridge = 4 points per $1, available once per day.  \n**Step 2**\nVisit the Meridian Finance lending markets  \n**Step 3**\nDouble your points by lending bridged funds in any market = 8 points per $1 of the bridged funds, available once per day.",
      point: "8 points per $1 in pool daily",
      image: meridian,
      buttons: [
        {
          text: "Go to Meridian Lend",
          link: "https://lend.meridianfinance.net/markets/",
        },
      ]
    },
    {
      id: "borrowOnMeridian",
      title: "Borrow on Meridian",
      description: "Borrow any asset on Meridian to get 12 points per $1 borrowed every day.  \n**Points will begin to accrue 24 hours after the borrow transaction.**",
      point: "12 points per $1 borrowed daily",
      image: meridian,
      buttons: [
        {
          text: "Go to Meridian Borrow",
          link: "https://lend.meridianfinance.net/borrow/",
        },
      ]
    },
    {
      id: "exploreArtrificOnFuse",
      title: "Create an NFT on Artrific",
      description: "Create an NFT on the leading NFT marketplace on Fuse Network and get 300 points  \n**Verify the quest 1 hour after completing it on Layer3**\n",
      point: "300 Points",
      frequency: "One-time",
      image: artrific,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/explore-artrific-nft-marketplace-on-fuse-network",
        },
        {
          text: "Verify Quest",
          isFunction: true,
        }
      ]
    },
    {
      id: "g$Claim",
      title: "Claim G$ on GoodDapp",
      description: "To get 30 points daily, you need to take 6 steps:  \n**Step 1:**\nGo to quest on the Layer3 platform  \n**Step 2:**\nConnect to Layer3 a wallet participating in the airdrop  \n**Step 3:**\nGo to GoodDapp  \n**Step 4:**\nClaim G$ token on Fuse Network  \n**Step 5:**\nVerify quest completion on the Layer3  \n**Step 6:**\nRepeat every day. After 5 claims, the quest will renew automatically and allow you to claim more and more.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: "30 Points per claim",
      frequency: "Once a day",
      image: gooddollar,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/streaks/claim-dollarg",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "gooddollar",
        }
      ]
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
        if (newQuest.frequency === "Once a day") {
          return newQuest;
        }

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
      if (localStorage.getItem("airdrop-isClaimTestnetFuse")) {
        dispatch(setIsClaimTestnetFuseModalOpen(true));
        localStorage.removeItem("airdrop-isClaimTestnetFuse");
      }
    }
  }, [dispatch, router, twitterConnected])

  useEffect(() => {
    if (twitterAuthUrl) {
      router.push(twitterAuthUrl);
    }
  }, [router, twitterAuthUrl])

  return (
    <div className="w-8/9 grow flex flex-col text-fuse-black my-20 xl:my-12 xl:w-9/12 md:w-9/10 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="flex flex-col gap-2">
          <span className="text-3xl font-semibold md:text-xl">
            fuse
          </span>
          <span className="bg-linear-gradient-black bg-clip-text text-8xl text-[transparent] font-black md:text-4xl">
            Foundation
          </span>
        </h1>
      </div>
      <div className="flex flex-wrap justify-between gap-6 bg-lightest-gray rounded-[20px] mt-11 mb-[100px] xl:mb-11 p-8">
        <div className="flex flex-row items-center gap-6">
          <div>
            <Avatar size={80} />
          </div>
          <div className="md:shrink">
            <p className="text-lg leading-none text-text-dark-gray font-medium">
              My points
            </p>
            <div className="flex items-center gap-1.5 mt-6 xl:mt-2 mb-2">
              <Image
                src={pointHexagon}
                alt="point hexagon"
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
                <div className="group relative cursor-pointer flex justify-center items-center mb-1">
                  <Image
                    src={questionMark}
                    alt="question mark"
                    width={13}
                    height={13}
                  />
                  <div className="tooltip-text-up hidden top-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                    <p>
                      Points calculation updated every 24 hours. Next update {convertTimestampToUTC(user.nextRewardDistributionTime)}
                    </p>
                  </div>
                </div>
              </div>
            ) : <div></div>}
          </div>
        </div>
        <div>
          <p className="text-lg xl:text-base leading-none text-text-dark-gray font-medium">
            Your Rank
          </p>
          <p className="text-5xl xl:text-4xl leading-none font-bold mt-6 xl:mt-2 mb-2 lg:m-0">
            {new Intl.NumberFormat().format(user.leaderboardPosition)}
          </p>
          <Link
            href={path.AIRDROP_LEADERBOARD}
            className="group flex items-center gap-1 text-sm text-text-dark-gray"
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
        <div className="relative w-1/3 xl:w-fit">
          <Image
            src={fuseAirdropPhase}
            alt="Fuse Airdrop phase"
            width={220}
            height={250}
            className="absolute -top-3/4 xl:hidden"
          />
          <div className="ms-52 xl:ms-0 flex flex-col gap-2">
            <p className="text-sm max-w-48">
              Fuse is migrating to a zkEvm L2 (Fuse Ember) and taking its robust comunity with it
            </p>
            <a
              href="https://news.fuse.io/announcing-fuse-ember-and-our-updated-roadmap/"
              target="_blank"
              className="group flex items-center gap-1 font-semibold"
            >
              Learn more
              <Image
                src={rightCaretBlack}
                alt="right caret"
                width={7}
                height={13}
                className="transition ease-in-out group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6">
        <h2 className="text-3xl font-semibold">
          Start earning points
        </h2>
        <div className="flex flex-row md:flex-col gap-[30px] xl:gap-5">
          <CardContainer containerClassName="block p-0 w-1/2 md:w-auto min-h-[283px] xl:min-h-56" className="block h-full">
            <CardBody className="bg-fuse-black text-white rounded-[20px] flex md:flex-col justify-between md:gap-4 p-10 xl:p-[30px] w-auto h-full">
              <div className="flex flex-col justify-between md:gap-2">
                <div className="flex flex-col gap-4 xl:gap-3 md:gap-2">
                  <CardItem
                    as="p"
                    translateZ="200"
                    className="text-2xl xl:text-xl text-success font-bold"
                  >
                    Bridge FUSE
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="100"
                    className="text-lg xl:text-base text-pale-slate font-medium max-w-[200px] md:max-w-[243px]"
                  >
                    Get 4 points daily on every $1 you bridge to Fuse
                  </CardItem>
                </div>
                <div>
                  <CardItem translateZ="80">
                    <button
                      className="transition ease-in-out border border-success rounded-full text-success leading-none font-semibold px-9 py-4 xl:px-7 xl:py-2.5 hover:bg-success hover:text-black"
                      onClick={() => {
                        dispatch(setIsQuestModalOpen(true));
                        dispatch(setSelectedQuest({
                          id: "bridge",
                          title: "Bridge FUSE",
                          point: "4 point per 1 USD bridged",
                          image: bridgeFuse,
                          buttons: [
                            {
                              text: "Go to the Bridge",
                              link: "https://console.fuse.io/bridge",
                            }
                          ],
                        }));
                      }}
                    >
                      Learn More
                    </button>
                  </CardItem>
                </div>
              </div>
              <CardItem
                translateZ="40"
                className="md:m-auto"
              >
                <Image
                  src={bridgeFuse}
                  alt="bridge Fuse"
                  width={227}
                  height={167}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer containerClassName="block p-0 w-1/2 md:w-auto min-h-[283px] xl:min-h-56 md:min-h-[430px]" className="block h-full md:min-h-[430px]">
            <CardBody className="bg-fuse-black text-white rounded-[20px] flex flex-col justify-between md:justify-start xl:gap-2 md:gap-12 p-10 xl:p-[30px] w-auto h-full md:min-h-[430px] bg-[url('/vectors/globe.svg')] md:bg-[url('/vectors/globe-mobile.svg')] bg-no-repeat bg-right-bottom md:bg-bottom xl:bg-contain">
              <div className="flex flex-col gap-4 xl:gap-3">
                <CardItem
                  as="p"
                  translateZ="50"
                  className="text-2xl xl:text-xl text-success font-bold"
                >
                  Invite friends
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-lg xl:text-base text-pale-slate font-medium max-w-[243px]"
                >
                  {"Get 20% of your friend's total points"}
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
                    className="truncate text-2xl xl:text-xl text-white font-bold max-w-sm"
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
            </CardBody>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6 mt-24 xl:mt-16">
        <h2 className="text-3xl font-semibold">
          {isTwitterFollowed(user) ? "Explore the Fuse ecosystem" : "Follow Fuse on X to unlock quests"}
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-1 auto-rows-min gap-[30px] xl:gap-5">
          {quests.filter((quest) => !quest.isEcosystem).map((quest) => (
            <Quest key={quest.title} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
