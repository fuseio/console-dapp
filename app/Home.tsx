import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import Link from "next/link";
import { useAccount } from "wagmi";
import { path } from "@/lib/helpers";
import mobileSdk from "@/assets/mobile-sdk.svg";
import webSdk from "@/assets/web-sdk.svg";
import faucet from "@/assets/faucet.svg";
import fusebox from "@/assets/fusebox.svg";
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";

const Home = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[130.98px] mb-[187px] md:w-9/10 max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-[70px]/[84.35px] text-fuse-black font-semibold max-w-[474px]">
            Welcome to Fuse Console
          </h1>
          <p className="text-[20px]/7 text-text-dark-gray md:text-base mt-[22px] mb-[36.52px] max-w-[395.25px]">
            Start your journey on Fuse
          </p>
          {!isConnected &&
            <Button
              text="Connect Wallet"
              className="transition ease-in-out text-lg font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
              padding="py-4 px-[52px]"
              onClick={() => {
                dispatch(setIsWalletModalOpen(true));
              }}
            />
          }
        </div>
        <div className="transition-all ease-in-out bg-lightest-gray hover:bg-success rounded-[20px] px-[83.31px] pt-[60.36px] pb-[67px] md:px-4 md:py-6 mt-[99.5px] mb-10 bg-[url('/vectors/build-mobiles.svg')] hover:bg-[url('/vectors/build-mobiles-white.svg')] bg-no-repeat bg-bottom">
          <p className="text-[40px] leading-tight text-fuse-black font-semibold max-w-[414.86px]">
            Build your Web3 project with Fuse
          </p>
          <p className="text-[20px]/7 text-text-dark-gray md:text-base max-w-[395.25px] mt-[15.42px] mb-[35.58px]">
            Easily access affordable Web3 payment & loyalty infrastructure
            without development hurdles or vendor dependencies.
          </p>
          <Link
            href="/build"
            className="transition ease-in-out text-lg text-white hover:text-black font-semibold bg-black hover:bg-white rounded-full py-4 px-[52px] md:px-6"
            onClick={() => amplitude.track("Home: Create project")}
          >
            Create your project
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-[31px]">
          <Link
            href={path.STAKING}
            className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:px-4 md:pt-6 min-h-[420px] md:min-h-[400px] bg-[url('/vectors/stake.svg')] hover:bg-[url('/vectors/stake-green.svg')] bg-no-repeat bg-bottom"
          >
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Stake
            </p>
            <p className="text-text-dark-gray max-w-[309.2px]">
              Earn over 10% annually and enhance the security and efficiency of the Fuse blockchain.
            </p>
          </Link>
          <Link
            href={path.BRIDGE}
            className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:px-4 md:pt-6 min-h-[420px] md:min-h-[400px] bg-[url('/vectors/bridge.svg')] hover:bg-[url('/vectors/bridge-green.svg')] bg-no-repeat bg-bottom"
          >
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Bridge
            </p>
            <p className="text-text-dark-gray max-w-[325px]">
              Transfer funds to and from other blockchains to Fuse quickly and affordably.
            </p>
          </Link>
          <Link
            href={path.WALLET}
            className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:px-4 md:pt-6 min-h-[420px] md:min-h-[400px] bg-[url('/vectors/check-balance.svg')] hover:bg-[url('/vectors/check-balance-green.svg')] bg-no-repeat bg-bottom"
          >
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Wallet
            </p>
            <p className="text-text-dark-gray max-w-[307px]">
              Create or sign in with a Web3 wallet and manage your assets.
            </p>
          </Link>
        </div>
        <div className="flex flex-col mt-[140.5px]">
          <p className="text-[40px] leading-tight text-fuse-black font-semibold">
            Developer tools
          </p>
          <div className="grid grid-cols-4 md:grid-cols-1 gap-[30px] mt-[45.64px] mb-[151.36px]">
            <a
              href="https://docs.fuse.io/docs/developers/fuse-box/flutter-sdk/"
              target="_blank"
              className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Mobile SDK
                </p>
                <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
                  Build Smart Contract Wallets with Flutter SDK
                </p>
                <Image
                  src={mobileSdk}
                  alt="mobile sdk"
                  width={80}
                  height={80}
                />
              </div>
            </a>
            <a
              href="https://docs.fuse.io/docs/developers/fuse-box/fuse-connect"
              target="_blank"
              className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Web SDK
                </p>
                <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
                  Easy way to Account Abstraction using JS SDK
                </p>
                <Image
                  src={webSdk}
                  alt="Fuse connect"
                  width={92}
                  height={65}
                />
              </div>
            </a>
            <a
              href="https://stakely.io/en/faucet/fuse-fuse"
              target="_blank"
              className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Fuse Faucet
                </p>
                <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
                  Get free FUSE for tests
                </p>
                <Image
                  src={faucet}
                  alt="faucet"
                  width={62}
                  height={91}
                />
              </div>
            </a>
            <a
              href="https://docs.fuse.io/docs/category/fusebox"
              target="_blank"
              className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  FuseBox
                </p>
                <p className="text-sm text-text-dark-gray text-center max-w-[213.4px]">
                  Discover Fuse middleware API&apos;s
                </p>
                <Image
                  src={fusebox}
                  alt="Fusebox"
                  width={70}
                  height={81}
                />
              </div>
            </a>
          </div>
          <DocumentSupport />
        </div>
      </div>
    </div>
  );
};

export default Home;
