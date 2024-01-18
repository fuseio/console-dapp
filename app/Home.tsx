import Image from "next/image";
import Button from "@/components/ui/Button";
import checkBalance from "@/public/check-balance.png";
import bridge from "@/public/bridge.png";
import stake from "@/public/stake.png";
import exploreApps from "@/public/explore-apps.png";
import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import Link from "next/link";
import { useAccount } from "wagmi";

const Home = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[130.98px] mb-[187px] md:w-9/10 max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-[70px]/[84.35px] text-fuse-black font-semibold max-w-[680.37px]">
            Welcome to the Fuse console
          </h1>
          <p className="text-[20px]/7 text-text-dark-gray md:text-base mt-[22px] mb-[36.52px]">
            A one-stop-shop for everything you need
          </p>
          <div className="h-16">
            {!isConnected &&
              <Button
                text="Connect Wallet"
                className="text-lg font-semibold bg-pale-green rounded-full"
                padding="py-4 px-[52px]"
                onClick={() => {
                  dispatch(setIsWalletModalOpen(true));
                }}
              />
            }
          </div>
        </div>
        <div className="bg-lightest-gray rounded-[20px] px-[83.31px] pt-[60.36px] pb-[67px] md:px-4 md:py-6 mt-[99.5px] mb-10 bg-[url('/vectors/build-mobiles.svg')] bg-no-repeat bg-bottom">
          <p className="text-[40px] leading-tight text-fuse-black font-semibold max-w-[414.86px]">
            Build your Web3 project with Fuse
          </p>
          <p className="text-[20px]/7 text-text-dark-gray md:text-base max-w-[395.25px] mt-[15.42px] mb-[35.58px]">
            A low cost Web3 payments without the development headaches or vendor lock-in
          </p>
          <Link
            href="/build"
            className="text-lg text-white font-semibold bg-black rounded-full py-4 px-[52px] md:px-6"
          >
            Create your project
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[30.5px]">
          <div className="flex flex-row md:flex-col gap-4 justify-between bg-white rounded-[20px] px-[57px] pt-11 md:px-4 md:pt-6">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Check your wallet balance
            </p>
            <Image
              src={checkBalance}
              alt="check balance"
              width={277}
              height={292}
              className="md:m-auto"
            />
          </div>
          <div className="flex flex-row md:flex-col gap-4 justify-between bg-white rounded-[20px] px-[57px] pt-11 md:px-4 md:pt-6">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Bridge
            </p>
            <Image
              src={bridge}
              alt="bridge"
              width={277}
              height={252}
              className="md:m-auto"
            />
          </div>
          <div className="flex flex-row md:flex-col gap-4 justify-between bg-white rounded-[20px] px-[57px] pt-11 md:px-4 md:pt-6">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Stake
            </p>
            <Image
              src={stake}
              alt="stake"
              width={277}
              height={252}
              className="md:m-auto"
            />
          </div>
          <div className="flex flex-row md:flex-col gap-4 justify-between bg-white rounded-[20px] px-[57px] pt-11 md:px-4 md:pt-6">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Explore our Apps & Services
            </p>
            <Image
              src={exploreApps}
              alt="explore apps"
              width={277}
              height={252}
              className="md:m-auto"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[44.26px] mt-[140.5px]">
          <p className="text-[40px] leading-tight text-fuse-black font-semibold">
            Developer tools
          </p>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-[30px]">
            <div className="flex justify-between bg-white rounded-[20px] p-12 md:px-4 md:py-6 min-h-[261px]">
              <p className="text-lg text-black font-bold max-w-[204.2px]">
                Read the Docs
              </p>
            </div>
            <div className="flex justify-between bg-white rounded-[20px] p-12 md:px-4 md:py-6 min-h-[261px]">
              <p className="text-lg text-black font-bold max-w-[204.2px]">
                Fuse SDK
              </p>
            </div>
            <div className="flex justify-between bg-white rounded-[20px] p-12 md:px-4 md:py-6 min-h-[261px]">
              <p className="text-lg text-black font-bold max-w-[204.2px]">
                Explore the Ecosystem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
