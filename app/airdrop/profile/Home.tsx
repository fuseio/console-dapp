import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useBalance, useBlockNumber } from "wagmi";
import { formatUnits } from "viem";

import Copy from "@/components/ui/Copy";
import { convertTimestampToUTC, eclipseAddress, evmDecimals, IS_SERVER, isFloat } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice, setIsClaimTestnetFuseModalOpen } from "@/store/airdropSlice";
import Avatar from "@/components/ui/Avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/Card3D";
import Quest from "@/components/airdrop/Quest";
import { AirdropQuests } from "@/lib/types";
import { flash } from "@/lib/web3Auth";

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
import volt from "@/assets/volt-wallet.svg";
import artrific from "@/assets/artrific.svg";
import gooddollar from "@/assets/gooddollar.svg";
import shoebill from "@/assets/shoebill.svg";
import meridian from "@/assets/meridian.svg";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user, twitterAuthUrl, isRetrieving, isFetchingReferral, referrals } = useAppSelector(selectAirdropSlice);
  const router = useRouter();
  const searchParams = useSearchParams();
  const twitterConnected = searchParams.get('twitter-connected');
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address: user.walletAddress,
    chainId: flash.id
  });

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
      isCustom: true,
    },
    {
      id: "emberFaucet",
      title: "Claim FUSE on faucet",
      point: 50,
      frequency: "Once a day",
      image: fuseFaucet,
      isCustom: true,
      completed: false
    },
    {
      id: "rouletteGame",
      title: "Roulette game",
      point: 20,
      frequency: "Up to 10 times a day",
      image: rouletteGame,
      comingSoon: true,
    },
    {
      id: "exploreVoltWallet",
      title: "Install the Volt wallet",
      description: "The Volt wallet is the best mobile solution for interacting with the Fuse network, as it is built and developed by the Fuse team. Explore its features and get 200 points.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 200,
      frequency: "One-time",
      image: volt,
      isEcosystem: true,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/explore-volt-wallet",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "explore-volt-wallet",
        }
      ]
    },
    {
      id: "exploreArtrificOnFuse",
      title: "Create an NFT on Artrific",
      description: "Create an NFT on the leading NFT marketplace on Fuse Network and get 300 points  \n**Verify the quest 1 hour after completing it on Layer3**\n",
      point: 300,
      frequency: "One-time",
      image: artrific,
      isEcosystem: true,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/explore-artrific-nft-marketplace-on-fuse-network",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "explore-artrific-on-fuse",
        }
      ]
    },
    {
      id: "g$Claim",
      title: "Claim G$ on GoodDapp",
      description: "To get 30 points daily, you need to take 6 steps:  \n**Step 1:**\nGo to quest on the Layer3 platform  \n**Step 2:**\nConnect to Layer3 a wallet participating in the airdrop  \n**Step 3:**\nGo to GoodDapp  \n**Step 4:**\nClaim G$ token on Fuse Network  \n**Step 5:**\nVerify quest completion on the Layer3  \n**Step 6:**\nRepeat every day. After 5 claims, the quest will renew automatically and allow you to claim more and more.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 30,
      frequency: "Multiple",
      image: gooddollar,
      isEcosystem: true,
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
    {
      id: "exploreVoltageDex",
      title: "Explore Voltage Finance",
      description: "Trade, invest, and earn with just a few clicks.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 200,
      frequency: "One-time",
      image: volt,
      isEcosystem: true,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/voltage-on-fuse-network",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "explore-voltage-dex",
        }
      ]
    },
    {
      id: "exploreShoebillOnFuse",
      title: "Explore Shoebill on Fuse",
      description: "Explore Shoebill Finance capabilities and get 200 points.  \n**Verify the quest 1 hour after completing it on Layer3**",
      point: 200,
      frequency: "One-time",
      image: shoebill,
      isEcosystem: true,
      buttons: [
        {
          text: "Go to Quest",
          link: "https://app.layer3.xyz/quests/explore-shoebill-finance-on-fuse-network",
        },
        {
          text: "Verify Quest",
          isFunction: true,
          endpoint: "explore-shoebill-on-fuse",
        }
      ]
    },
    {
      id: "provideMeridianLiquidity",
      title: "Lend on Meridian",
      description: "Lend on Meridian & Multiply your points easily with these quick steps  \n**Step 1**\nBridge funds to Fuse Network using the Fuse bridge = 4 points per $1, available once per day.  \n**Step 2**\nVisit the Meridian Finance lending markets  \n**Step 3**\nDouble your points by lending bridged funds in any market = 12 points per $1 of the bridged funds, available once per day.",
      point: 12,
      frequency: "Multiple",
      image: meridian,
      isEcosystem: true,
      comingSoon: true,
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
      point: 12,
      frequency: "Multiple",
      image: meridian,
      isEcosystem: true,
      comingSoon: true,
      buttons: [
        {
          text: "Go to Meridian Borrow",
          link: "https://lend.meridianfinance.net/borrow/",
        },
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

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch])

  return (
    <div className="w-8/9 grow flex flex-col text-fuse-black my-16 xl:my-14 xl:w-9/12 md:w-9/10 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl xl:text-3xl font-semibold">
          Hey, {eclipseAddress(user.walletAddress)}
        </h1>
      </div>
      <div className="flex flex-wrap justify-between gap-6 bg-lightest-gray rounded-[20px] mt-11 mb-[100px] xl:mb-11 p-8">
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
            My $FUSE
          </p>
          <div className="flex xl:flex-col items-center gap-4 mt-6 xl:mt-2 mb-2 lg:m-0">
            <p className="text-5xl xl:text-4xl leading-none font-bold">
              {formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0"} $FUSE
            </p>
            <button
              className="transition ease-in-out bg-fuse-black border border-fuse-black rounded-full leading-none text-white font-semibold px-6 py-3 hover:bg-[transparent] hover:text-fuse-black"
              onClick={() => dispatch(setIsClaimTestnetFuseModalOpen(true))}
            >
              Claim $FUSE
            </button>
          </div>
          <div></div>
        </div>
        <div className="relative w-1/3 xl:w-fit">
          <Image
            src={ember}
            alt="ember"
            width={220}
            height={250}
            className="absolute -top-full xl:hidden"
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
                src={rightCaret}
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
                    Get FUSE on testnet
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="90"
                    className="text-lg leading-none text-ash-gray font-medium max-w-80"
                  >
                    Get FUSE on the faucet. You can request every minute.
                  </CardItem>
                </div>
                <CardItem
                  translateZ="30"
                  className="transition ease-in-out w-fit bg-white border border-white rounded-full text-black leading-none font-semibold text-center px-16 py-4 hover:bg-black hover:text-white"
                  onClick={() => dispatch(setIsClaimTestnetFuseModalOpen(true))}
                  as="button"
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
                    Get 20% of your referrals points
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
                      className="truncate text-[1.25rem] xl:text-xl font-bold max-w-sm"
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
                <div className="flex flex-col gap-2.5 xl:gap-2">
                  <CardItem
                    as="p"
                    translateZ="110"
                    className="text-sm xl:text-xs text-text-dark-gray font-medium"
                  >
                    No. of my referrals
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="70"
                    className="truncate text-[1.25rem] xl:text-xl font-bold max-w-sm"
                  >
                    {(isRetrieving || isFetchingReferral) ?
                      <span className="px-10 py-4 rounded-2xl animate-pulse bg-black/20"></span>
                      : referrals ?? user.referrals ?? 0}
                  </CardItem>
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
          {quests.filter((quest) => !quest.isEcosystem).map((quest) => (
            <Quest key={quest.title} quest={quest} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-8 xl:gap-6 mt-24 xl:mt-16">
        <h2 className="text-3xl font-semibold">
          Explore the Fuse ecosystem
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-1 auto-rows-min gap-[30px] xl:gap-5">
          {quests.filter((quest) => quest.isEcosystem).map((quest) => (
            <Quest key={quest.title} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
