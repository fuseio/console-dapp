import Image from "next/image";

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

const Hero = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 text-center">
      <h1 className="bg-linear-gradient-black bg-clip-text text-[10.625rem] leading-none text-[transparent] font-black md:text-4xl">
        Builder Grants
      </h1>
      <p className="text-lg max-w-md">
        A bounty program rewarding developers for building apps on Ember.
      </p>
      <article className="bg-night rounded-[2.5rem] mt-3 px-4 py-20 w-full relative min-h-[773px]">
        <p className="text-2xl text-sand font-semibold">
          Prize pool
        </p>
        <p className="bg-linear-gradient-sand bg-clip-text [text-shadow:_0_4px_4px_#FFE9AD] text-[8.75rem] text-sand font-bold">
          3,900,000 FUSE
        </p>
        <Image src={prizePool} alt="" width={1450} height={630} className="absolute -bottom-8 -left-6 scale-[1.15]" />
      </article>
    </section>
  );
};

const Bounty = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-1 gap-24">
      <div className="grid grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <article key={bounty.title} className="transition-all duration-300 relative group flex flex-col justify-center items-center gap-4 bg-white rounded-3xl p-4 hover:bg-marzipan hover:shadow-marzipan">
            <Image src={bounty.icon} alt="" width={40} height={40} />
            <p className="text-center text-lg font-semibold">{bounty.title}</p>
            <div className="tooltip-text-black hidden -top-10 absolute -translate-y-1/2 bg-black p-3 rounded-2xl w-54 shadow-lg group-hover:block text-black text-sm font-medium">
              <p className="text-sm text-light-gray">{bounty.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-7xl font-semibold">
          Bounty list
        </h2>
        <p>
          The bounty program covers a wide range of categories to encourage diverse and innovative apps. Multiple winners can be selected in each category. To qualify, your app must fit into one of the following categories:
        </p>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="grow my-20 text-fuse-black flex flex-col gap-32 md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Hero />
      <hr className="w-full border-black border-t-[0.3px] border-black" />
      <Bounty />
    </div>
  );
};

export default Home;
