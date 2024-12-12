import Image from "next/image";
import { useAccount } from "wagmi";

import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectAirdropSlice } from "@/store/airdropSlice";
import Spinner from "@/components/ui/Spinner";

import RightCaret from "@/assets/RightCaret";
import rightCaret from "@/assets/right-caret-black.svg";
import airdrop from "@/assets/airdrop-right.svg";
import fuseFoundation from "@/assets/fuse-foundation.svg";
import fuseFounders from "@/assets/fuse-founders.svg";
import fuseFlash from "@/assets/fuse-flash.svg";
import fuseEmber from "@/assets/fuse-ember.svg";

const Hero = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const { isConnecting } = useAccount();

  const isLoading = isConnecting || airdropSlice.isAuthenticating || airdropSlice.isCreating || airdropSlice.isRetrieving;

  return (
    <div className="flex flex-col justify-center items-center gap-7 text-center">
      <h1 className="flex flex-col gap-4">
        <span className="text-3xl font-semibold md:text-xl">
          Welcome to the fuse
        </span>
        <span className="bg-linear-gradient-black bg-clip-text text-[10.625rem] leading-none text-[transparent] font-black md:text-4xl">
          Airdrop
        </span>
      </h1>
      <p className="text-lg max-w-[40rem]">
        Join the Fuse Airdrop! Get into Fuse, connect your wallet and earn Rewards with ease: Join the Explosive Airdrop Campaign
      </p>
      <div className="flex items-center gap-8 md:flex-col">
        <div className="group relative z-10">
          <button
            className="transition-all ease-in-out duration-300 flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full scale-100 group-hover:scale-95"
            disabled={isLoading}
            onClick={() => {
              dispatch(setIsWalletModalOpen(true));
            }}
          >
            Join the Airdrop
            {isLoading ? <Spinner /> : <RightCaret />}
          </button>
          <div className="transition-all ease-in-out duration-300 absolute inset-8 bg-linear-gradient-dark-orange rounded-[inherit] blur-[25px] -z-[1] group-hover:inset-0"></div>
        </div>
        <a
          href="https://news.fuse.io/announcing-fuse-ember-and-our-updated-roadmap/"
          target="_blank"
          className="group flex items-center gap-2 text-[1.25rem] leading-none font-semibold"
        >
          Learn more
          <Image
            src={rightCaret}
            alt="right caret"
            width={10}
            height={20}
            className="transition ease-in-out group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
};

const Giveaway = () => {
  return (
    <div className="flex justify-center items-center bg-black rounded-[1.25rem] text-white px-4 py-20 mt-28 md:py-10 md:mt-20">
      <div className="w-full max-w-4xl">
        <p className="text-center text-[1.25rem] leading-none font-semibold md:text-base">
          Giving away
        </p>
        <div className="relative text-center">
          <Image
            src={airdrop}
            alt="airdrop"
            width={306}
            height={394}
            className="absolute -top-72 -left-14 md:left-3/4"
          />
          <p className="relative left-10 text-8xl leading-none font-semibold mt-6 md:-left-2 md:text-3xl">
            63,000,000 FUSE
          </p>
        </div>
        <p className="text-center text-[1.25rem] leading-none font-semibold mt-14 md:text-base md:mt-8">
          Phase 1 is live now!
        </p>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between items-center">
            <Image
              src={fuseFoundation}
              alt="Fuse Foundation"
              width={80}
              height={80}
            />
            <Image
              src={fuseFounders}
              alt="Fuse Founders"
              width={80}
              height={80}
              className="relative left-6 md:left-0"
            />
            <Image
              src={fuseFlash}
              alt="Fuse Flash"
              width={60}
              height={60}
              className="relative left-5 md:left-0"
            />
            <Image
              src={fuseEmber}
              alt="Fuse Ember"
              width={70}
              height={70}
            />
          </div>
          <div className="flex justify-between items-center w-[calc(100%-4rem)] ml-8 relative z-10">
            <span className="shrink-0 bg-pale-green w-4 h-4 rounded-full"></span>
            <span className="shrink-0 bg-peach-orange w-4 h-4 rounded-full relative left-9 md:left-2"></span>
            <span className="shrink-0 bg-atomic-tangerine w-4 h-4 rounded-full relative left-8 md:left-2"></span>
            <span className="shrink-0 bg-sunset-orange w-4 h-4 rounded-full"></span>
            <div className="absolute bg-charcoal-gray w-full h-1.5 rounded-full -z-10">
              <span className="block bg-linear-gradient-green-red w-[calc(1/6*100%+2rem)] h-1.5 rounded-full z-10"></span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg leading-none font-semibold md:text-sm">
              Foundations
            </p>
            <p className="text-lg leading-none font-semibold md:text-sm">
              Founders
            </p>
            <p className="text-lg leading-none font-semibold md:text-sm">
              Flash
            </p>
            <p className="text-lg leading-none font-semibold md:text-sm">
              Ember
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Phases = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col justify-around gap-14 mt-28 relative md:mt-16">
      <div className="absolute left-0 top-0 w-1.5 h-full bg-linear-gradient-green-red-bottom rounded-full -z-10"></div>
      <div className="flex justify-between items-center gap-4 py-10 pr-10 md:py-4 md:pr-4 md:flex-col">
        <div className="flex justify-between items-center gap-24 xl:gap-14 md:gap-4">
          <span className="shrink-0 bg-pale-green w-6 h-6 rounded-full relative -left-[0.6rem] md:-left-2"></span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[1.25rem] leading-none font-medium md:text-base">
                Phase 1
              </p>
              <p className="bg-success text-lg leading-none font-medium px-4 py-2 rounded-full md:text-base md:py-1">
                Live
              </p>
            </div>
            <p className="text-7xl md:text-2xl leading-none font-semibold">
              Fuse Foundation
            </p>
            <p className="text-lg max-w-xs">
              Explore the Fuse ecosystem and expand liquidity through Quests
            </p>
            <button
              className="transition ease-in-out w-fit px-12 py-4 mt-4 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
              onClick={() => {
                dispatch(setIsWalletModalOpen(true));
              }}
            >
              Get started
            </button>
          </div>
        </div>
        <Image
          src={fuseFoundation}
          alt="Fuse Foundation"
          width={300}
          height={350}
          className="md:order-first"
        />
      </div>
      <div className="flex justify-between items-center gap-4 py-10 pr-10 md:py-4 md:pr-4 md:flex-col">
        <div className="flex justify-between items-center gap-24 xl:gap-14 md:gap-4">
          <span className="shrink-0 bg-peach-orange w-6 h-6 rounded-full relative -left-[0.6rem] md:-left-2"></span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[1.25rem] leading-none font-medium md:text-base">
                Phase 2
              </p>
              <p className="bg-lightest-gray text-lg leading-none font-medium px-4 py-2 rounded-full md:text-base md:py-1">
                Loading
              </p>
            </div>
            <p className="text-7xl md:text-2xl leading-none font-semibold">
              Fuse Founders
            </p>
            <p className="text-lg max-w-2xl">
              Earn points with a campaign incentivizing building on the new Ember (Flash) Testnet first, then migrating apps to the new Ember Mainnet.
            </p>
          </div>
        </div>
        <Image
          src={fuseFounders}
          alt="Fuse Founders"
          width={300}
          height={350}
          className="md:order-first"
        />
      </div>
      <div className="flex justify-between items-center gap-4 py-10 pr-10 md:py-4 md:pr-4 md:flex-col">
        <div className="flex justify-between items-center gap-24 xl:gap-14 md:gap-4">
          <span className="shrink-0 bg-atomic-tangerine w-6 h-6 rounded-full relative -left-[0.6rem] md:-left-2"></span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[1.25rem] leading-none font-medium md:text-base">
                Phase 3
              </p>
              <p className="bg-lightest-gray text-lg leading-none font-medium px-4 py-2 rounded-full md:text-base md:py-1">
                Loading
              </p>
            </div>
            <p className="text-7xl md:text-2xl leading-none font-semibold">
              Fuse Flash
            </p>
            <p className="text-lg max-w-lg">
              Interact with the Flash Testnet, test its functionality, and earn points that will convert into tokens on Fuse Ember at launch.
            </p>
          </div>
        </div>
        <Image
          src={fuseFlash}
          alt="Fuse Flash"
          width={200}
          height={250}
          className="relative right-10 md:right-0 md:order-first"
        />
      </div>
      <div className="flex justify-between items-center gap-4 py-10 pr-10 md:py-4 md:pr-4 md:flex-col">
        <div className="flex justify-between items-center gap-24 xl:gap-14 md:gap-4">
          <span className="shrink-0 bg-sunset-orange w-6 h-6 rounded-full relative -left-[0.6rem] md:-left-2"></span>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[1.25rem] leading-none font-medium md:text-base">
                Phase 4
              </p>
              <p className="bg-lightest-gray text-lg leading-none font-medium px-4 py-2 rounded-full md:text-base md:py-1">
                Loading
              </p>
            </div>
            <p className="text-7xl md:text-2xl leading-none font-semibold">
              Fuse Ember
            </p>
            <p className="text-lg max-w-[34rem]">
              Access and earn by engaging with our next-gen Layer 2 zkEVM Web3 payment & loyalty infrastructure  - Fuse Ember..
            </p>
          </div>
        </div>
        <Image
          src={fuseEmber}
          alt="Fuse Ember"
          width={200}
          height={250}
          className="relative right-10 md:right-0 md:order-first"
        />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="grow w-8/9 my-20 max-w-7xl text-fuse-black md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Hero />
      <Giveaway />
      <Phases />
    </div>
  );
};

export default Home;
