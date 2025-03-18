import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSwitchChain } from "wagmi";

import { flash } from "@/lib/web3Auth";

import prizePool from "@/assets/airdrop-grant-prize-background.svg";
import wallet from "@/assets/wallet.svg";
import paid from "@/assets/paid.svg";
import agriculture from "@/assets/agriculture.svg";
import esports from "@/assets/esports.svg";
import build from "@/assets/build.svg";
import mintmark from "@/assets/mintmark.svg";
import currencyExchange from "@/assets/currency-exchange.svg";
import group from "@/assets/group.svg";
import smartToy from "@/assets/smart-toy.svg";
import article from "@/assets/article.svg";
import uploadFile from "@/assets/upload-file.svg";
import clockOrange from "@/assets/clock-orange.svg";
import savingsOrange from "@/assets/savings-orange.svg";
import batteryOrange from "@/assets/battery-orange.svg";
import robotOrange from "@/assets/robot-orange.svg";
import moneyBagOrange from "@/assets/money-bag-orange.svg";
import flashWallet from "@/assets/flash-wallet.png";
import walletGray from "@/assets/wallet-gray.svg";
import twitterWhite from "@/assets/twitter-white.svg";
import discordWhite from "@/assets/discord-white.svg";
import telegramWhite from "@/assets/telegram-white.svg";

const bounties = [
  {
    title: "Payments",
    description: "Debit cards supporting FUSE and USDC.",
    icon: wallet,
  },
  {
    title: "Stablecoins",
    description: "CDP stablecoins, yield-bearing stablecoins, RWA-backed stablecoins.",
    icon: paid,
  },
  {
    title: "Yield",
    description: "Fixed yield, yield aggregators, cross-chain yield tokenization.",
    icon: agriculture,
  },
  {
    title: "Gaming",
    description: "Prediction markets, single-click games, gamified NFT games.",
    icon: esports,
  },
  {
    title: "Tooling",
    description: "Vote incentive markets, liquid locker protocols.",
    icon: build,
  },
  {
    title: "Lending",
    description: "Simple lending markets, isolated lending markets.",
    icon: mintmark,
  },
  {
    title: "Exchanges",
    description: "Perpetual markets, options markets, AMMs, CLOB exchanges.",
    icon: currencyExchange,
  },
  {
    title: "Community Movements",
    description: "Brand ambassador campaigns, user-engagement campaigns.",
    icon: group,
  },
  {
    title: "DePIN & AI",
    description: "Wireless networks, energy grids, computation, storage.",
    icon: smartToy,
  },
];

const applyLink = "https://docs.google.com/forms/d/e/1FAIpQLServsLcjBhksX0bGXsE9jwf8qixP4HlKq2jEiJmwEjFxPxX8w/viewform"

const joins = [
  {
    title: "Explore the Developer Docs",
    description: "Dive into our comprehensive documentation to understand the Ember platform and its capabilities.",
    icon: article,
    button: {
      title: "Start building",
      link: "https://docs.fuse.io/fuse-ember/connect-to-ember"
    },
  },
  {
    title: "Submit Your Application",
    description: "Once your app is ready, apply for the bounty program to showcase your work and earn rewards.",
    icon: uploadFile,
    button: {
      title: "Apply Now",
      link: applyLink
    },
  },
];

const thingsToDo = {
  build: {
    1: "Deploy Smart Contracts on ZKEVM",
    2: "Experiment with AI Agents & Account Abstraction",
    3: "Grow within a Thriving Ecosystem",
  },
  play: {
    1: "Get Testnet FUSE",
    2: "Make a Transaction",
    3: "Earn Rewards",
  }
};

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-[url('/flash-background.png')] bg-cover bg-center">
      <div className="w-8/9 max-w-3xl mx-auto flex flex-col justify-center items-center gap-8 text-center">
        <h1 className="text-[4.375rem] leading-none text-fuse-black font-semibold md:text-4xl">
          Test, Build, and Scale on FUSE Flash
        </h1>
        <p className="text-[2.188rem] text-fuse-black font-semibold leading-none md:text-lg">
          The ZKEVM Testnet for Real-World Payments
        </p>
        <p className="text-[1.25rem]">
          FUSE Flash is the testnet for FUSE Ember, a ZKEVM Layer 2 blockchain designed for seamless payments, ultra-low fees, and high-speed transactions. Experiment, deploy, and earn rewards while doing it.
        </p>
        <Link
          href="#zkevm"
          className="transition ease-in-out mt-4 px-12 py-4 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}

const Zkevm = () => {
  return (
    <section id="zkevm" className="w-8/9 max-w-7xl mx-auto flex flex-col gap-10 py-28 md:py-16">
      <h2 className="text-center text-5xl text-fuse-black font-semibold md:text-2xl">
        What is FUSE Ember ZKEVM?
      </h2>
      <article className="grid grid-cols-2 gap-5 bg-fuse-black rounded-[1.25rem] py-12 pl-12 md:grid-cols-1 md:px-4 md:py-6">
        <div className="flex flex-col gap-5 text-white">
          <p className="text-5xl font-semibold max-w-lg md:text-2xl">
            The Real-World L2 Blockchain for Payments
          </p>
          <p className="text-[1.25rem] text-light-gray">
            FUSE Ember is a next-generation ZKEVM Layer 2, optimized for payments, scalability, and real-world use cases. Built for speed, efficiency, and enterprise adoption, it makes Web3 transactions feel as seamless as traditional finance.
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-4">
              <Image src={clockOrange} alt="" width={40} height={40} />
              <p className="text-2xl font-bold md:text-lg">
                9,000+ TPS, outpacing Visa.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <Image src={savingsOrange} alt="" width={40} height={40} />
              <p className="text-2xl font-bold md:text-lg">
                Near-Zero Fees
              </p>
            </li>
            <li className="flex items-start gap-4">
              <Image src={batteryOrange} alt="" width={40} height={40} />
              <p className="text-2xl font-bold md:text-lg">
                Powered by Polygon, Avail, and QuickNode.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <Image src={robotOrange} alt="" width={40} height={40} />
              <p className="text-2xl font-bold md:text-lg">
                AI Agents & Account Abstraction
              </p>
            </li>
            <li className="flex items-start gap-4">
              <Image src={moneyBagOrange} alt="" width={40} height={40} />
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold md:text-lg">
                  Earn Rewards
                </p>
                <p className="max-w-md">
                  Generate transactions now to earn FUSE Ember Points, redeemable on mainnet launch.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <Image src={flashWallet} alt="" width={633} height={566} />
      </article>
    </section>
  );
};

const Start = () => {
  const [selectedTab, setSelectedTab] = useState<"build" | "play">("build");
  const { switchChain } = useSwitchChain()

  const getTestnetFuse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col gap-10 py-28 md:py-16">
      <h2 className="text-center text-5xl text-fuse-black font-semibold md:text-2xl">
        Getting Started
      </h2>
      <div className="grid grid-cols-2 gap-10 md:grid-cols-1">
        <article className="bg-white rounded-[1.25rem] flex flex-col gap-5 px-5 py-10">
          <div className="flex justify-between items-center border border-lightest-gray p-1 rounded-2xl">
            <button
              className="relative p-3 w-1/2"
              onClick={() => setSelectedTab("build")}
            >
              {selectedTab === "build" && (
                <motion.div
                  layoutId="underline"
                  className="absolute z-0 bg-success-light rounded-xl text-success-dark inset-0"
                />
              )}
              <span className={`relative z-10 leading-none font-semibold ${selectedTab === "build" ? "text-success-dark" : ""}`}>
                Build
              </span>
            </button>
            <button
              className="relative p-3 w-1/2"
              onClick={() => setSelectedTab("play")}
            >
              {selectedTab === "play" && (
                <motion.div
                  layoutId="underline"
                  className="absolute z-0 bg-success-light rounded-xl text-success-dark inset-0"
                />
              )}
              <span className={`relative z-10 leading-none font-semibold ${selectedTab === "play" ? "text-success-dark" : ""}`}>
                Play
              </span>
            </button>
          </div>
          <p className="text-2xl font-bold md:text-lg">
            Things to do:
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success-dark font-semibold">
                1
              </div>
              <p className="text-[1.25rem] md:text-base">
                {thingsToDo[selectedTab][1]}
              </p>
            </li>
            <li className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success-dark font-semibold">
                2
              </div>
              <p className="text-[1.25rem] md:text-base">
                {thingsToDo[selectedTab][2]}
              </p>
            </li>
            <li className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success-dark font-semibold">
                3
              </div>
              <p className="text-[1.25rem] md:text-base">
                {thingsToDo[selectedTab][3]}
              </p>
            </li>
          </ul>
          <div className="flex items-center gap-x-8 gap-y-4 md:flex-col">
            <button
              className="transition ease-in-out px-12 py-3 bg-success border border-success text-lg leading-none text-black font-semibold rounded-full hover:bg-[transparent] hover:border-black"
              onClick={() => switchChain({ chainId: flash.id })}
            >
              Add Fuse Flash Testnet
            </button>
            {selectedTab === "build" && (
              <Link
                href={applyLink}
                target="_blank"
                className="group flex items-center gap-2 font-semibold hover:opacity-50"
              >
                Apply for a Grant
                <ArrowRight className="transition ease-in-out group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </article>
        <article className="bg-white rounded-[1.25rem] flex flex-col justify-between gap-5 px-5 py-10 md:py-6">
          <form onSubmit={getTestnetFuse} className="flex flex-col gap-10 md:gap-6">
            <p className="text-2xl font-bold md:text-lg">
              Enter wallet address
            </p>
            <div className="flex items-center gap-4 bg-light-gray rounded-lg px-6 py-4">
              <Image src={walletGray} alt="" width={17} height={16} />
              <input type="text" placeholder="0x6bd9...480e" className="w-full bg-[transparent] outline-none placeholder:text-text-dark-gray" required />
            </div>
            <button
              className="transition ease-in-out px-12 py-3 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
            >
              Get Testnet FUSE
            </button>
          </form>
          <p className="text-sm">
            <span className="font-semibold underline">Note:</span> <span className="opacity-50">{"If you're having trouble, check your existing EVM addresses - testnet tokens might already be there."}</span>
          </p>
        </article>
      </div>
    </section>
  );
};

const Earn = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 text-center py-28 md:py-16">
      <h2 className="text-center text-5xl text-fuse-black font-semibold md:text-2xl">
        Build and Earn
      </h2>
      <p className="text-[1.25rem] max-w-xl">
        A builder grant program rewarding projects for building apps on Ember.
      </p>
      <article className="bg-night rounded-[2.5rem] mt-3 px-4 py-20 w-full relative min-h-[773px] flex flex-col gap-8 md:rounded-2xl md:p-4 md:min-h-0 md:gap-4">
        <p className="text-2xl text-sand font-semibold md:text-base">
          Prize pool
        </p>
        <p className="bg-linear-gradient-sand bg-clip-text drop-shadow-light-tan text-[8.75rem] leading-none text-[transparent] font-bold md:drop-shadow-none md:text-3xl">
          3,900,000 FUSE
        </p>
        <Image src={prizePool} alt="" width={1450} height={630} className="absolute -bottom-8 -left-6 scale-[1.15] md:relative md:scale-100 md:bottom-0 md:left-0" />
      </article>
    </section>
  );
};

const Bounty = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-1 gap-x-24 gap-y-6 py-28 md:py-16">
      <div className="grid grid-cols-3 gap-6 md:grid-cols-2 md:gap-4">
        {bounties.map((bounty) => (
          <article key={bounty.title} className="transition-all duration-300 relative group flex flex-col justify-center items-center gap-4 bg-white rounded-3xl p-4 hover:bg-marzipan hover:shadow-marzipan">
            <Image src={bounty.icon} alt="" width={40} height={40} />
            <p className="text-center text-lg font-semibold">{bounty.title}</p>
            <div className="tooltip-text-black hidden -top-4 absolute -translate-y-full bg-black p-3 rounded-2xl w-54 shadow-lg group-hover:block text-black text-sm font-medium">
              <p className="text-sm text-light-gray">{bounty.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <p>
          {"We're thrilled that you're exploring Fuse ecosystem! The Grants program is aimed at providing initial support for talented teams to kick off product development or migrate a successful existing product to Fuse. We welcome initiatives that bring unique value to the ecosystem and attracting new users."}
        </p>
        <p>
          {"The program covers a wide range of categories to encourage diverse and innovative apps. Multiple winners can be selected in each category. To qualify, your app must fit into one of the following categories:"}
        </p>
      </div>
    </section>
  );
};

const Winner = () => {
  return (
    <section className="min-h-[693px] bg-fuse-black bg-[url('/vectors/airdrop-grant-winner-background.svg')] bg-center bg-no-repeat md:min-h-72 md:bg-bottom md:bg-contain">
      <div className="min-h-[inherit] w-8/9 max-w-7xl mx-auto py-6 flex flex-col justify-center items-end md:justify-start">
        <div className="w-full max-w-md flex flex-col gap-5 md:gap-4">
          <h2 className="text-7xl text-marzipan font-semibold md:text-2xl">
            Be a Winner!
          </h2>
          <p className="text-white max-w-[26.5rem]">
            At least 3 best projects will be selected and awarded. But if there are more amazing projects, everyone will get a bounty!
          </p>
        </div>
      </div>
    </section>
  );
};

const Join = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col gap-10 py-28 md:py-16">
      <div className="flex flex-col items-center gap-5 md:gap-4">
        <h2 className="text-center text-5xl text-fuse-black font-semibold md:text-2xl">
          Build and Apply
        </h2>
        <p className="text-center text-[1.25rem] max-w-md">
          Join us in building the next generation of Ember apps. Start building right now on Flash testnet
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-20 gap-y-4 md:grid-cols-1">
        {joins.map((join) => (
          <article key={join.title} className="bg-white rounded-[1.25rem] p-10 flex flex-col gap-8 md:px-4 md:py-6 md:gap-4">
            <Image src={join.icon} alt="" width={70} height={70} />
            <p className="text-2xl font-bold">
              {join.title}
            </p>
            <p className="max-w-md">
              {join.description}
            </p>
            <Link
              href={join.button.link}
              target={join.button.link !== "#" ? "_blank" : "_self"}
              className="transition ease-in-out w-fit px-12 py-4 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
            >
              {join.button.title}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

const Community = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col gap-10 py-16">
      <h2 className="text-center text-5xl text-fuse-black font-semibold md:text-2xl">
        The Fuse Communities
      </h2>
      <div className="grid grid-cols-3 gap-x-12 gap-y-6 md:grid-cols-1">
        <Link
          href="https://x.com/Fuse_network"
          target="_blank"
          className="bg-lightest-gray rounded-[1.25rem] p-5 flex flex-col justify-center items-center gap-2 text-center hover:opacity-50"
        >
          <p className="text-[1.25rem] font-bold">
            X
          </p>
          <p className="text-sm text-text-dark-gray max-w-xs">
            Stay up to date with the latest on the Fuse ecosystem.
          </p>
          <Image src={twitterWhite} alt="" width={71} height={66} />
        </Link>
        <Link
          href="https://discord.com/invite/jpPMeSZ"
          target="_blank"
          className="bg-lightest-gray rounded-[1.25rem] p-5 flex flex-col justify-center items-center gap-2 text-center hover:opacity-50"
        >
          <p className="text-[1.25rem] font-bold">
            Discord
          </p>
          <p className="text-sm text-text-dark-gray max-w-xs">
            Follow Fuse on Discord and Connect with other builders
          </p>
          <Image src={discordWhite} alt="" width={85} height={66} />
        </Link>
        <Link
          href="https://t.me/fuseio"
          target="_blank"
          className="bg-lightest-gray rounded-[1.25rem] p-5 flex flex-col justify-center items-center gap-2 text-center hover:opacity-50"
        >
          <p className="text-[1.25rem] font-bold">
            Telegram
          </p>
          <p className="text-sm text-text-dark-gray max-w-xs">
            Make friends, ask questions, learn about Web3 on our Telegram channel
          </p>
          <Image src={telegramWhite} alt="" width={77} height={66} />
        </Link>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="grow mb-20 text-fuse-black flex flex-col md:w-full md:mb-12 md:overflow-hidden">
      <Hero />
      <Zkevm />
      <hr className="w-full border-black border-t-[0.3px] border-black" />
      <Start />
      <hr className="w-full border-black border-t-[0.3px] border-black" />
      <Earn />
      <hr className="w-full border-black border-t-[0.3px] border-black" />
      <Bounty />
      <Winner />
      <Join />
      <Community />
    </div>
  );
};

export default Home;
