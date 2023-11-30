import { useEffect } from "react";
import Button from "@/components/ui/Button";
import dollar from "@/assets/dollar.svg"
import receive from "@/assets/receive.svg"
import send from "@/assets/send.svg"
import dollarMobile from "@/assets/dollar-mobile.svg"
import receiveMobile from "@/assets/receive-mobile.svg"
import sendMobile from "@/assets/send-mobile.svg"
import rightArrow from "@/assets/right-arrow.svg"
import { eclipseAddress, walletType } from "@/lib/helpers";
import copy from "@/assets/copy2.svg";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import TransfiModal from "@/components/console/TransfiModal";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { fuse } from "wagmi/chains";
import { setIsTransfiModalOpen } from "@/store/navbarSlice";
import * as amplitude from "@amplitude/analytics-browser";

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const controller = new AbortController();
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({
    address,
    watch: true,
    chainId: fuse.id
  });

  useEffect(() => {
    dispatch(fetchUsdPrice({
      tokenId: "fuse-network-token",
      controller
    }))

    return () => {
      controller.abort();
    }
  }, [isConnected])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TransfiModal />
      <div className="w-8/9 flex flex-col gap-y-[32.98px] mt-16 mb-[187px] md:w-9/10 max-w-7xl">
        <div>
          <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
            Console
          </h1>
          <p className="text-xl font-normal mt-4 text-text-dark-gray md:text-base">
            Access Fuse network services through one simple dashboard
          </p>
        </div>
        <div className="flex flex-col gap-y-[30px]">
          <div className="bg-fuse-black rounded-[20px] text-white px-12 md:px-8 py-14 md:py-10">
            <div className="flex flex-row justify-between md:flex-col gap-12">
              <div className="flex flex-col gap-y-[62px]">
                <div className="flex flex-col gap-y-[18px]">
                  <p className="text-lg text-darker-gray">
                    Balance
                  </p>
                  <div className="flex items-end gap-x-[30px] md:gap-x-4">
                    <h1 className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                      {(chain && chain.id === fuse.id) ?
                        new Intl.NumberFormat().format(
                          parseFloat(balance.data?.formatted ?? "0")
                        ) :
                        0
                      } FUSE
                    </h1>
                    {balanceSlice.isUsdPriceLoading ?
                      <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
                      <p className="text-xl text-darker-gray">
                        ${(chain && chain.id === fuse.id) ?
                          new Intl.NumberFormat().format(
                            parseFloat((parseFloat(balance.data?.formatted ?? "0") * balanceSlice.price).toString())
                          ) :
                          0
                        }
                      </p>
                    }
                  </div>
                </div>
                {/* Buttons Desktop */}
                <div className="flex md:hidden gap-[30px]">
                  <Button
                    text={"Buy Fuse"}
                    onClick={() => {
                      amplitude.track("On-Ramp opened", {
                        walletType: connector ? walletType[connector.id] : undefined,
                        walletAddress: address
                      });
                      dispatch(setIsTransfiModalOpen(true));
                    }}
                    padding="py-[17.73px]"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-success text-black font-semibold rounded-full transition ease-in-out delay-150 hover:bg-fuse-green-bright"
                    isLeft
                  >
                    <img src={dollar.src} alt="dollar" />
                  </Button>
                  <Button
                    text={"Stake"}
                    onClick={() => {
                      amplitude.track("Go to Staking", {
                        walletType: connector ? walletType[connector.id] : undefined,
                        walletAddress: address
                      });
                      router.push("/staking");
                    }}
                    padding="py-[17.73px]"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-white text-black font-semibold rounded-full transition ease-in-out delay-150 hover:opacity-80"
                    disabledClassname="flex items-center justify-center gap-x-2.5 w-40 bg-button-inactive text-black font-semibold rounded-full"
                    isLeft
                  >
                    <img src={receive.src} alt="receive" />
                  </Button>
                  <Button
                    text={"Bridge"}
                    onClick={() => {
                      amplitude.track("Go to Bridge", {
                        walletType: connector ? walletType[connector.id] : undefined,
                        walletAddress: address
                      });
                      router.push("/bridge");
                    }}
                    padding="py-[17.73px]"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-white text-black font-semibold rounded-full transition ease-in-out delay-150 hover:opacity-80"
                    disabledClassname="flex items-center justify-center gap-x-2.5 w-40 bg-button-inactive text-black font-semibold rounded-full"
                    isLeft
                  >
                    <img src={send.src} alt="send" />
                  </Button>
                </div>
                {/* Buttons Mobile */}
                <div className="hidden md:flex justify-between">
                  <div className="flex flex-col justify-center items-center gap-4">
                    <Button
                      text={""}
                      onClick={() => {
                        amplitude.track("On-Ramp opened", {
                          walletType: connector ? walletType[connector.id] : undefined,
                          walletAddress: address
                        });
                        dispatch(setIsTransfiModalOpen(true));
                      }}
                      padding=""
                      className="flex items-center justify-center w-16 h-16 bg-success text-black font-semibold rounded-full"
                      disabledClassname="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                    >
                      <img src={dollarMobile.src} alt="dollar" />
                    </Button>
                    <p className="text-success font-semibold whitespace-nowrap">
                      Buy Fuse
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4">
                    <Button
                      text={""}
                      onClick={() => {
                        amplitude.track("Go to Staking", {
                          walletType: connector ? walletType[connector.id] : undefined,
                          walletAddress: address
                        });
                        router.push("/staking");
                      }}
                      padding=""
                      className="flex items-center justify-center w-16 h-16 bg-white text-black font-semibold rounded-full"
                      disabledClassname="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                      isLeft
                    >
                      <img src={receiveMobile.src} alt="receive" />
                    </Button>
                    <p className="text-white font-semibold whitespace-nowrap">
                      Stake
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4">
                    <Button
                      text={""}
                      onClick={() => {
                        amplitude.track("Go to Bridge", {
                          walletType: connector ? walletType[connector.id] : undefined,
                          walletAddress: address
                        });
                        router.push("/bridge");
                      }}
                      padding=""
                      className="flex items-center justify-center w-16 h-16 bg-white text-black font-semibold rounded-full"
                      disabledClassname="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                      isLeft
                    >
                      <img src={sendMobile.src} alt="send" />
                    </Button>
                    <p className="text-white font-semibold whitespace-nowrap">
                      Bridge
                    </p>
                  </div>
                </div>
              </div>
              {isConnected &&
                <div className="flex flex-col gap-4 md:hidden">
                  <p className="text-success">
                    Wallet Address
                  </p>
                  <span className="text-darker-gray text-base flex">
                    {eclipseAddress(String(address))}
                    <img
                      src={copy.src}
                      alt="Copy"
                      className="ms-2 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(String(address));
                      }}
                    />
                  </span>
                </div>
              }
            </div>
          </div>
          <div className="flex md:flex-col gap-[30px]">
            <div className="flex flex-col justify-between items-start gap-y-3 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Build on Fuse
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  Join the Fuse console list to be the first
                  to receive latest news, access to new features
                  and special offers.
                </p>
              </div>
              <div className="flex gap-8">
                <a
                  href="mailto:console@fuse.io"
                  className="group flex gap-1 text-black font-semibold"
                  onClick={() => amplitude.track("Contact us", {
                    walletType: connector ? walletType[connector.id] : undefined,
                    walletAddress: address
                  })}
                >
                  <p>Contact us</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://docs.fuse.io"
                  target="_blank"
                  className="group flex gap-1 text-black font-semibold"
                  onClick={() => amplitude.track("Go to Docs", {
                    walletType: connector ? walletType[connector.id] : undefined,
                    walletAddress: address
                  })}
                >
                  <p>Read docs</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-3 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Get API Key
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  Sign in to our developer dashboard to
                  receive your API key and start using the
                  Fuse SDK
                </p>
              </div>
              <div className="flex gap-8">
                <a
                  href="https://developers.fuse.io"
                  target="_blank"
                  className="group flex gap-1 text-black font-semibold"
                  onClick={() => amplitude.track("Go to Developers app", {
                    walletType: connector ? walletType[connector.id] : undefined,
                    walletAddress: address
                  })}
                >
                  <p>Get API key</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-3 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[35px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Operator Account
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  Generate a operator account on Fuse which is a contract wallet that allows
                  business operators to pay their network services and for their customers.
                </p>
              </div>
              <div className="flex gap-8">
                <Button
                  text={"Create Account"}
                  className="bg-fuse-black text-white rounded-full font-semibold"
                  padding="px-[31px] py-[19.5px]"
                  onClick={() => router.push("/operator")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
