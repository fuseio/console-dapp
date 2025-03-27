import Image from 'next/image';
import Link from 'next/link';
import * as amplitude from '@amplitude/analytics-browser';

import DocumentSupport from '@/components/DocumentSupport';
import { path } from '@/lib/helpers';
import Wallet from '@/components/landing/Wallet';
import DeveloperTools from '@/components/DeveloperTools';

import pointsPhases from "@/assets/points-phases.png";

const Home = () => {
  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col gap-28 md:gap-20 mt-20 mb-40 md:mb-20 md:mt-10 md:w-9/10 max-w-7xl">
        <div className='flex flex-col gap-10 md:gap-5'>
          <Wallet />
          <div className="transition-all ease-in-out bg-lightest-gray hover:bg-success rounded-[20px] md:min-h-[514px] p-12 md:p-6 bg-[url('/vectors/build-mobiles.svg')] hover:bg-[url('/vectors/build-mobiles-white.svg')] bg-no-repeat bg-[right_top] md:bg-[center_bottom]">
            <p className="text-[40px] md:text-[32px] leading-tight text-fuse-black font-semibold">
              Build your Web3 project with Fuse
            </p>
            <p className="text-[20px]/7 text-text-dark-gray md:text-base max-w-[40rem] mt-[15.42px] mb-[35.58px]">
              Easily access affordable Web3 payment & loyalty infrastructure
              without development hurdles or vendor dependencies.
            </p>
            <Link
              href="/build"
              className="transition ease-in-out md:block md:text-center text-lg leading-none text-white hover:text-black font-semibold bg-black hover:bg-white rounded-full py-4 px-[52px] md:px-2 md:w-11/12 md:max-w-[270px]"
              onClick={() => amplitude.track("Home: Create project")}
            >
              Create your project
            </Link>
          </div>
          <div className="flex justify-between items-center gap-x-4 gap-6 bg-black rounded-[1.25rem] px-16 py-10 md:p-7 md:flex-col">
            <div className="flex flex-col justify-between items-start gap-5 md:gap-3">
              <p className="text-2xl text-white font-semibold md:text-lg">
                Fuse Rewards
              </p>
              <p className="bg-linear-gradient-green-thumb bg-clip-text text-[transparent] text-[3.5rem] leading-none font-bold max-w-96 md:text-3xl">
                Explore Fuse Ember & Earn Rewards
              </p>
              <Link
                href={path.AIRDROP}
                className="transition ease-in-out px-12 py-3 bg-white border border-white rounded-full text-lg leading-none font-semibold hover:bg-[transparent] hover:text-white"
                onClick={() => amplitude.track("Home: Ember Rewards")}
              >
                Explore & Earn
              </Link>
            </div>
            <Image src={pointsPhases} alt="rewards phases" width={650} height={180} />
          </div>
        </div>
        <div className="flex flex-col gap-8 md:gap-5">
          <h2 className="text-5xl md:text-3xl leading-tight text-fuse-black font-semibold">
            Bridge and Stake on Fuse
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-[31px] md:gap-5">
            <Link
              href={path.STAKING}
              className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:pl-9 md:pt-[33px] md:pr-[30px] md:pb-4 min-h-[420px] bg-[url('/vectors/stake.svg')] hover:bg-[url('/vectors/stake-green.svg')] bg-no-repeat bg-bottom md:bg-[center_bottom_-10%]"
              onClick={() => amplitude.track("Go to Staking")}
            >
              <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
                Stake
              </p>
              <p className="text-text-dark-gray max-w-[309.2px]">
                Earn annually and enhance the security and efficiency of the Fuse blockchain.
              </p>
            </Link>
            <Link
              href={path.BRIDGE}
              className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:pl-9 md:pt-[33px] md:pr-[30px] md:pb-4 md:px-4 md:pt-6 min-h-[420px] bg-[url('/vectors/bridge.svg')] hover:bg-[url('/vectors/bridge-green.svg')] bg-no-repeat bg-bottom md:bg-[center_bottom_-10%]"
              onClick={() => amplitude.track("Go to Bridge")}
            >
              <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
                Bridge
              </p>
              <p className="text-text-dark-gray max-w-[325px]">
                Transfer funds to and from other blockchains to Fuse quickly and affordably.
              </p>
            </Link>
            <Link
              href={path.BUILD}
              className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:pl-9 md:pt-[33px] md:pr-[30px] md:pb-4 md:px-4 md:pt-6 min-h-[420px] bg-[url('/vectors/operator-background.svg')] hover:bg-[url('/vectors/operator-background.svg')] bg-no-repeat bg-bottom"
            >
              <p className="text-2xl leading-tight text-fuse-black font-bold">
                Become an operator
              </p>
              <p className="text-text-dark-gray">
                Become an operator to run you project
              </p>
            </Link>
          </div>
        </div>
        <DeveloperTools />
        <DocumentSupport />
      </div>
    </div>
  );
};

export default Home;
