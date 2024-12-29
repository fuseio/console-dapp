import Image from "next/image";
import Link from "next/link";

import FAQ from "@/components/FAQ";

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

const joins = [
  {
    title: "Explore the Developer Docs",
    description: "Dive into our comprehensive documentation to understand the Ember platform and its capabilities.",
    icon: article,
    button: {
      title: "Start building",
      link: "#"
    },
  },
  {
    title: "Submit Your Application",
    description: "Once your app is ready, apply for the bounty program to showcase your work and earn rewards.",
    icon: uploadFile,
    button: {
      title: "Apply Now",
      link: "https://docs.google.com/forms/d/e/1FAIpQLServsLcjBhksX0bGXsE9jwf8qixP4HlKq2jEiJmwEjFxPxX8w/viewform"
    },
  },
];

const questions = [
  "What is Fuse Ember?",
  "How do I apply to Fuse Ember bounty program?",
  "Who can participate in the Fuse Ember bounty program?",
  "What types of projects can be submitted?",
  "How are winners selected?",
  "How much bounty will each winner get?",
  "When will the Fuse Ember bounty be distributed?",
  "What support is available for participants?",
  "Can existing projects participate?",
  "?"
]

const answers = [
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
  "Fuse Nodes are devices (computers or servers) that run the Fuse blockchain's protocol software and connect to its network. They participate  in the Fuse Network by maintaining a copy of the ",
]

const Hero = () => {
  return (
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 text-center">
      <h1 className="bg-linear-gradient-black bg-clip-text text-[10.625rem] leading-none text-[transparent] font-black md:text-4xl">
        Builder Grants
      </h1>
      <p className="text-lg max-w-md">
        A bounty program rewarding developers for building apps on Ember.
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
    <section className="w-8/9 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-1 gap-x-24 gap-y-6">
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
        <h2 className="text-7xl font-semibold md:text-2xl">
          Bounty list
        </h2>
        <p>
          The bounty program covers a wide range of categories to encourage diverse and innovative apps. Multiple winners can be selected in each category. To qualify, your app must fit into one of the following categories:
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
    <section className="w-8/9 max-w-7xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col items-center gap-5 md:items-start md:gap-4">
        <h2 className="text-7xl font-semibold md:text-2xl">
          Build and Apply
        </h2>
        <p className="max-w-sm">
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

const Home = () => {
  return (
    <div className="grow my-20 text-fuse-black flex flex-col gap-40 md:w-full md:my-12 md:overflow-hidden md:gap-20">
      <Hero />
      <hr className="w-full border-black border-t-[0.3px] border-black" />
      <Bounty />
      <Winner />
      <Join />
      <FAQ
        className="w-8/9 max-w-7xl mx-auto"
        questions={questions}
        answers={answers}
      />
    </div>
  );
};

export default Home;
