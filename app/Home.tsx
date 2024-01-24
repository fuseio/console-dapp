import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/store/store";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import Link from "next/link";
import { useAccount } from "wagmi";
import fuseBasics from "@/assets/fuse-basics.svg";
import fuseToken from "@/assets/fuse-token.svg";
import fuseSdk from "@/assets/fuse-sdk.svg";
import fuseGuides from "@/assets/fuse-guides.svg";

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
        <div className="transition-all ease-in-out bg-lightest-gray hover:bg-success rounded-[20px] hover:shadow-inner-black px-[83.31px] pt-[60.36px] pb-[67px] md:px-4 md:py-6 mt-[99.5px] mb-10 bg-[url('/vectors/build-mobiles.svg')] hover:bg-[url('/vectors/build-mobiles-white.svg')] bg-no-repeat bg-bottom">
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
        <div className="grid grid-cols-2 md:grid-cols-1 gap-[30.5px]">
          <div className="transition-all ease-in-out flex flex-row md:flex-col gap-4 justify-between bg-lightest-gray hover:bg-success rounded-[20px] hover:shadow-inner-black px-[57px] pt-11 md:px-4 md:pt-6 min-h-[305px] md:min-h-[350px] bg-[url('/vectors/check-balance.svg')] hover:bg-[url('/vectors/check-balance-green.svg')] bg-no-repeat bg-[right_57px_bottom] md:bg-bottom">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Check your wallet balance
            </p>
          </div>
          <div className="transition-all ease-in-out flex flex-row md:flex-col gap-4 justify-between bg-lightest-gray hover:bg-success rounded-[20px] hover:shadow-inner-black px-[57px] pt-11 md:px-4 md:pt-6 min-h-[305px] md:min-h-[350px] bg-[url('/vectors/bridge.svg')] hover:bg-[url('/vectors/bridge-green.svg')] bg-no-repeat bg-[right_57px_bottom] md:bg-bottom">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Bridge
            </p>
          </div>
          <div className="transition-all ease-in-out flex flex-row md:flex-col gap-4 justify-between bg-lightest-gray hover:bg-success rounded-[20px] hover:shadow-inner-black px-[57px] pt-11 md:px-4 md:pt-6 min-h-[305px] md:min-h-[350px] bg-[url('/vectors/stake.svg')] hover:bg-[url('/vectors/stake-green.svg')] bg-no-repeat bg-[right_57px_bottom] md:bg-bottom">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Stake
            </p>
          </div>
          <div className="transition-all ease-in-out flex flex-row md:flex-col gap-4 justify-between bg-lightest-gray hover:bg-success rounded-[20px] hover:shadow-inner-black px-[57px] pt-11 md:px-4 md:pt-6 min-h-[305px] md:min-h-[350px] bg-[url('/vectors/explore-apps.svg')] hover:bg-[url('/vectors/explore-apps-green.svg')] bg-no-repeat bg-[right_57px_bottom] md:bg-bottom">
            <p className="text-2xl leading-tight text-fuse-black font-bold max-w-[204.2px]">
              Explore our Apps & Services
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[44.26px] mt-[140.5px]">
          <p className="text-[40px] leading-tight text-fuse-black font-semibold">
            Developer tools
          </p>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-[30px]">
            <a
              href="https://docs.fuse.io/docs/category/intro-to-fuse"
              target="_blank"
              className="transition ease-in-out flex justify-between bg-white hover:bg-lightest-gray rounded-[20px] p-12 md:px-4 md:py-6 min-h-[250px]"
            >
              <div className="flex flex-col justify-between">
                <p className="text-2xl text-fuse-black font-bold max-w-[204.2px]">
                  Fuse Basics
                </p>
                <p className="text-lg text-text-dark-gray max-w-[265.2px]">
                  Learn all the basics about the Fuse network,
                  including network details, wallets, bridges and more.
                </p>
              </div>
              <Image
                src={fuseBasics}
                alt="Fuse basics"
                width={229}
                height={148}
              />
            </a>
            <a
              href="https://docs.fuse.io/docs/basics/intro-to-fuse/what-is-fuse#fuse-token"
              target="_blank"
              className="transition ease-in-out flex justify-between bg-white hover:bg-lightest-gray rounded-[20px] p-12 md:px-4 md:py-6 min-h-[250px]"
            >
              <div className="flex flex-col justify-between">
                <p className="text-2xl text-fuse-black font-bold max-w-[204.2px]">
                  Fuse Token
                </p>
                <p className="text-lg text-text-dark-gray max-w-[247.2px]">
                  Learn more about FUSE - the native currency of the Fuse Network.
                </p>
              </div>
              <Image
                src={fuseToken}
                alt="Fuse token"
                width={172}
                height={156}
              />
            </a>
            <a
              href="https://docs.fuse.io/docs/category/fusebox"
              target="_blank"
              className="transition ease-in-out flex justify-between bg-white hover:bg-lightest-gray rounded-[20px] p-12 md:px-4 md:py-6 min-h-[250px]"
            >
              <div className="flex flex-col justify-between">
                <p className="text-2xl text-fuse-black font-bold max-w-[204.2px]">
                  Fuse SDK
                </p>
                <p className="text-lg text-text-dark-gray max-w-[291.2px]">
                  Develop seamless UX with Fuse SDK on Fuse network,
                  leveraging account abstraction, gasless transactions, and more.
                </p>
              </div>
              <Image
                src={fuseSdk}
                alt="Fuse sdk"
                width={96}
                height={160}
              />
            </a>
            <a
              href="https://docs.fuse.io/docs/category/tutorials"
              target="_blank"
              className="transition ease-in-out flex justify-between bg-white hover:bg-lightest-gray rounded-[20px] p-12 md:px-4 md:py-6 min-h-[250px]"
            >
              <div className="flex flex-col justify-between">
                <p className="text-2xl text-fuse-black font-bold max-w-[204.2px]">
                  Fuse Guides
                </p>
                <p className="text-lg text-text-dark-gray max-w-[284.2px]">
                  Discover everything you need to know about Fuse
                  and how we are revolutionizing various industries with web3 technology.
                </p>
              </div>
              <Image
                src={fuseGuides}
                alt="Fuse guides"
                width={117}
                height={151}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
