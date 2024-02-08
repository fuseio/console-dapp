import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import Link from "next/link";
import { useAccount } from "wagmi";
import { path } from "@/lib/helpers";
import mobileSdk from "@/assets/mobile-sdk.svg";
import fuseConnect from "@/assets/fuse-connect.svg";
import fuseConnectGreen from "@/assets/fuse-connect-green.svg";
import faucet from "@/assets/faucet.svg";
import fusebox from "@/assets/fusebox.svg";
import { useState } from "react";
import DocumentSupport from "@/components/DocumentSupport";

const Home = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const [hover, setHover] = useState("");

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[130.98px] mb-[187px] md:w-9/10 max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-[70px]/[84.35px] text-fuse-black font-semibold max-w-[680.37px]">
            Welcome to the Fuse Console
          </h1>
          <p className="text-[20px]/7 text-text-dark-gray md:text-base mt-[22px] mb-[36.52px]">
            A one-stop-shop for everything you need
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
            A low cost Web3 payments without the development headaches or vendor lock-in
          </p>
          <Link
            href="/build"
            className="transition ease-in-out text-lg text-white hover:text-black font-semibold bg-black hover:bg-white rounded-full py-4 px-[52px] md:px-6"
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
            <p className="text-text-dark-gray max-w-[344.46px]">
              Participate in Fuse Network security
            </p>
          </Link>
          <Link
            href={path.BRIDGE}
            className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:px-4 md:pt-6 min-h-[420px] md:min-h-[400px] bg-[url('/vectors/bridge.svg')] hover:bg-[url('/vectors/bridge-green.svg')] bg-no-repeat bg-bottom"
          >
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Bridge
            </p>
            <p className="text-text-dark-gray max-w-[344.46px]">
              Transfer funds from popular blockchains to Fuse quickly and affordably
            </p>
          </Link>
          <Link
            href={path.WALLET}
            className="transition-all ease-in-out flex flex-col gap-[17.43px] bg-lightest-gray hover:bg-success rounded-[20px] pt-[42.36px] pr-[15px] pl-[46.8px] md:px-4 md:pt-6 min-h-[420px] md:min-h-[400px] bg-[url('/vectors/check-balance.svg')] hover:bg-[url('/vectors/check-balance-green.svg')] bg-no-repeat bg-bottom"
          >
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Wallet
            </p>
            <p className="text-text-dark-gray max-w-[344.46px]">
              Manage your crypto wallet with ease
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
              <div className="flex flex-col justify-between items-center m-auto max-w-[140px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Mobile SDK
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
              onMouseEnter={() => setHover("Fuse connect")}
              onMouseLeave={() => setHover("")}
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[140px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Fuse Connect
                </p>
                <Image
                  src={hover === "Fuse connect" ? fuseConnectGreen : fuseConnect}
                  alt="Fuse connect"
                  width={46}
                  height={76}
                />
              </div>
            </a>
            <a
              href="https://stakely.io/en/faucet/fuse-fuse"
              target="_blank"
              className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
            >
              <div className="flex flex-col justify-between items-center m-auto max-w-[140px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  Faucet
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
              <div className="flex flex-col justify-between items-center m-auto max-w-[140px] min-h-[144px]">
                <p className="text-[20px]/7 text-fuse-black font-bold">
                  FuseBox
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
