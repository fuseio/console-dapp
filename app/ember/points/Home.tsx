import Image from "next/image";
import Link from "next/link";
import {isFloat, path} from "@/lib/helpers";
import {useAppSelector} from "@/store/store";
import {selectAirdropSlice} from "@/store/airdropSlice";
import ConnectWallet from "@/components/ConnectWallet";
import firstBlockBg from "@/assets/token-migration-first-block.svg";
import secondBlockBg from "@/assets/token-migration-sbg.svg";
import leftArrow from "@/assets/left-arrow.svg";
import pointHexagon from "@/assets/fuse-foundation-point-hexagon.svg";
import innerEllipse from "@/assets/inner-ellipse.svg";
import outerEllipse from "@/assets/outer-ellipse.svg";
import ellipseQuestionMark from "@/assets/migration-tokens-question.svg";

import {useAccount} from "wagmi";

const Home = () => {
  const {user} = useAppSelector(selectAirdropSlice);
  const {isConnected} = useAccount();

  return (
    <div className="w-8/9 grow flex flex-col text-fuse-black my-20 xl:my-12 lg:my-8 md:my-6 px-4 md:px-6 xl:px-0 xl:w-9/12 md:w-[95%] max-w-7xl mx-auto">
      <Link
        href={path.AIRDROP}
        className="group flex items-center gap-1.5 hover:opacity-70"
      >
        <Image
          src={leftArrow}
          alt="back to Ember"
          width={7}
          height={13}
          className="transition ease-in-out group-hover:-translate-x-0.5"
        />
        <div className="leading-none font-semibold">Ember</div>
      </Link>
      <div className="flex items-center justify-center text-center mt-4 w-full">
        <h1 className="text-7xl font-semibold xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl w-full max-w-[474px]">
          Fuse Token Migration
        </h1>
      </div>
      <h2 className="text-[20px] mt-[1.2rem] leading-[148%] tracking-[0%] text-center text-[#666666] lg:text-lg md:text-base">
        Fuse token is migrating to the new Fuse Ember L2 mainnet soon!
      </h2>
      <div className="flex flex-wrap justify-between gap-6 bg-lightest-gray rounded-[1.25rem] mt-28 xl:mt-20 lg:mt-16 md:mt-10 mb-[6.25rem] xl:mb-16 lg:mb-12 md:mb-8 p-12 xl:p-8 lg:p-6 md:p-5 w-full lg:h-auto h-[24.19rem] relative overflow-hidden">
        <div className="max-w-[34.63rem] lg:max-w-full md:max-w-full h-auto flex flex-col gap-[2rem] xl:gap-4 lg:gap-3 relative z-10">
          <h1 className="w-full xl:w-full h-auto font-semibold text-[2.5rem] xl:text-[2rem] lg:text-[1.75rem] md:text-[1.5rem] leading-[121%] tracking-0">
            Fuse Ember Mainnet Launch and Token Migration
          </h1>
          <p className="max-w-[24.69rem] text-[1.25rem] xl:text-[1.1rem] lg:text-base md:text-sm leading-[130%] tracking-0 text-[#666666]">
            Were in the final stages of building the Fuse Ember mainnet. Once
            the network is launched, the one-way migration process for FUSE
            tokens from the legacy Layer-1 chain to the new Layer-2 platform
            will begin.
          </p>
        </div>
        <Image
          src={firstBlockBg}
          alt="Token migration illustration"
          className="absolute top-0 right-0 h-full w-auto object-cover lg:opacity-10 md:opacity-10"
          priority
        />
      </div>
      <div className="flex xl:flex-col lg:flex-col md:flex-col space-x-0 xl:space-x-0 gap-[11.81rem] xl:gap-8 lg:gap-6 md:gap-4 bg-lightest-gray rounded-[1.25rem] pl-[8.5rem] pr-[8.5rem] xl:px-8 lg:px-6 md:px-4 w-full h-auto xl:h-auto lg:h-auto relative overflow-hidden py-12 xl:py-10 lg:py-8 md:py-6 xl:items-center">
        <div className="max-w-[19.5rem] xl:max-w-full lg:max-w-full md:max-w-full mt-[3.125rem] xl:mt-5 lg:mt-4 md:mt-2 z-10 mx-auto xl:mx-auto">
          <div className="relative w-[312px] h-[312px] xl:w-[250px] xl:h-[250px] lg:w-[200px] lg:h-[200px] md:w-[180px] md:h-[180px] flex items-center justify-center mx-auto">
            <Image
              src={outerEllipse}
              alt="outerEllipse"
              width={312}
              height={312}
              className="absolute top-0 left-0 w-full h-full"
            />
            <Image
              src={innerEllipse}
              alt="innerEllipse"
              width={278.4}
              height={278.4}
              className="absolute top-[16.8px] left-[16.8px] xl:top-[13px] xl:left-[13px] lg:top-[10px] lg:left-[10px] md:top-[9px] md:left-[9px] w-[89%] h-[89%]"
            />
            <Image
              src={pointHexagon}
              alt="hexagon"
              width={98}
              height={113}
              className="absolute top-[88px] xl:top-[70px] lg:top-[50px] md:top-[45px] w-[30%]"
            />
            {isConnected ? (
              <p className="absolute top-[60%] text-white text-[72px] xl:text-[56px] lg:text-[48px] md:text-[40px] font-bold">
                {isFloat(user.points) ? user.points.toFixed(2) : user.points}
              </p>
            ) : (
              <Image
                src={ellipseQuestionMark}
                alt="question mark"
                width={28}
                height={48}
                className="absolute top-[119px] xl:top-[90px] lg:top-[65px] md:top-[55px]"
              />
            )}
          </div>
          <div className="md:shrink">
            <div className="flex items-center gap-1.5 mt-6 xl:mt-2 mb-2">
              <p className="text-5xl xl:text-4xl md:text-3xl leading-none font-bold"></p>
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-[32rem] h-[16.375rem] xl:h-auto lg:h-auto flex flex-col gap-[2rem] xl:gap-4 lg:gap-3 text-white mt-[75px] xl:mt-8 lg:mt-6 md:mt-4 justify-center lg:items-center xl:items-center xl:mx-auto xl:text-center">
          {isConnected ? (
            <>
              <h1 className="w-[32rem] xl:w-full h-[3rem] xl:h-auto font-semibold text-[2rem] xl:text-[1.75rem] lg:text-[1.5rem] md:text-[1.35rem] leading-[121%] text-center xl:text-center">
                Your Points
              </h1>
              {(isFloat(user.points) ? user.points.toFixed(2) : user.points) ===
              0 ? (
                <p className="text-[1.25rem] xl:text-[1.1rem] lg:text-base md:text-sm leading-[130%] tracking-[0%] text-[#FFFFFF] text-center xl:text-center">
                  The Points campaign has ended. Unfortunately, you havent
                  earned any points - but dont worry, theres still plenty to
                  look forward to! The Fuse Ember mainnet is launching soon, and
                  FUSE tokens will be migrated to a faster, more efficient, more
                  flexible Layer-2 network.
                </p>
              ) : (
                <p className="text-[1.25rem] xl:text-[1.1rem] leading-[130%] tracking-[0%] text-[#FFFFFF] text-center xl:text-center">
                  The Points campaign has ended. You have earned {user.points}{" "}
                  points. Thank you for participating! You points will be
                  converted to FUSE tokens following the Fuse Ember mainnet
                  launch. Stay tuned for more updates!
                </p>
              )}

              <p className="text-[1.25rem] xl:text-[1.1rem] leading-[130%] tracking-[0%] text-[#FFFFFF] text-center xl:text-center">
                Subscribe to our newsletter for regular updates.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4 items-center xl:items-center">
                <h1 className="w-full h-[3rem] xl:h-auto font-semibold text-[2rem] xl:text-[1.75rem] lg:text-[1.5rem] md:text-[1.35rem] leading-[121%] text-center xl:text-center">
                  Your Points
                </h1>
                <p className="text-[1.25rem] xl:text-[1.1rem] lg:text-base md:text-sm leading-[130%] tracking-[0%] text-[#FFFFFF] text-center xl:text-center">
                  Did you participate in the Points campaign? Connect your
                  wallet to check how many points you earned.
                </p>
                <p className="text-[1.25rem] xl:text-[1.1rem] lg:text-base md:text-sm leading-[130%] tracking-[0%] text-[#FFFFFF] text-center xl:text-center">
                  Your points will be converted to FUSE tokens following the
                  Fuse Ember mainnet launch.
                </p>
                <ConnectWallet
                  className="mt-6 xl:mt-4 bg-[transparent] text-white border border-white hover:bg-opacity-90"
                  defaultClassName="font-semibold py-3 px-10 rounded-full w-fit transition-all"
                />
              </div>
            </>
          )}
        </div>
        <Image
          src={secondBlockBg}
          alt="Token migration background"
          className="absolute top-0 left-0 w-full h-full object-cover"
          priority
        />
      </div>
      <div className="flex flex-wrap md:flex-col sm:flex-col justify-between gap-6 bg-lightest-gray rounded-[20px] mt-11 xl:mt-8 lg:mt-6 md:mt-5 mb-[100px] xl:mb-16 lg:mb-12 md:mb-8 p-8 xl:p-6 lg:p-5 md:p-4">
        <div className="flex flex-col flex-1 max-w-[50%] md:max-w-full sm:max-w-full">
          <h2 className="text-[2.5rem] xl:text-[2.2rem] lg:text-[1.8rem] md:text-[1.5rem] font-bold mb-4 md:mb-3 sm:mb-2">
            Keep me posted
          </h2>
          <p className="text-[1.25rem] xl:text-[1.1rem] lg:text-base md:text-sm text-[#666666] leading-[150%]">
            Stay up-to-date with the latest news and developments by subscribing
            to the Fuse newsletter.
          </p>
        </div>
        <div className="flex items-center md:mt-4 sm:mt-3 md:w-full sm:w-full">
          <iframe
            src="https://embeds.beehiiv.com/5ca0b43e-9cb7-46fc-9d16-11efead9d360?slim=true"
            data-test-id="beehiiv-embed"
            height="52"
            style={{
              margin: 0,
              borderRadius: "0px !important",
              backgroundColor: "transparent",
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Home;
