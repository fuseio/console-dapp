import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import dollar from "@/assets/dollar.svg";
import receive from "@/assets/receive.svg";
import send from "@/assets/send.svg";
import { eclipseAddress, evmDecimals, walletType } from "@/lib/helpers";
import copy from "@/assets/copy-white.svg";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import TransfiModal from "@/components/wallet/TransfiModal";
import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { fuse } from "wagmi/chains";
import { setIsTransfiModalOpen } from "@/store/navbarSlice";
import * as amplitude from "@amplitude/analytics-browser";
import Image from "next/image";
import fuseIcon from "@/assets/fuse-icon.svg";
import qr from "@/assets/qr-white.svg";
import Link from "next/link";
import QrModal from "@/components/wallet/QrModal";
import Copy from "@/components/ui/Copy";
import { formatUnits } from "viem";

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const controller = useMemo(() => new AbortController(), []);
  const { address, connector, isConnected, chain } = useAccount();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address,
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
  }, [controller, dispatch, isConnected])

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]) 

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TransfiModal />
      {isQrModalOpen && <QrModal value={address ? address : ''} size={200} setIsQrModalOpen={setIsQrModalOpen} />}
      <div className="w-8/9 flex flex-col gap-y-[32.98px] mt-16 mb-[187px] md:w-9/10 max-w-7xl">
        <div>
          <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
            Hello{isConnected ? `, ${address ? eclipseAddress(address) : ''}` : ""}
          </h1>
          <p className="text-[20px]/7 font-normal mt-4 text-text-dark-gray md:text-base">
            The one-stop-shop for all Fuse token holders.
          </p>
        </div>
        <div className="flex flex-col gap-y-[30px]">
          <div className="bg-fuse-black rounded-[20px] text-white px-12 md:px-4 py-[26px] md:py-6">
            <div className="flex flex-row justify-between md:flex-col gap-12">
              <div className="flex flex-col gap-y-[62px]">
                <div className="flex flex-col gap-y-[18px]">
                  <p className="text-lg leading-none text-darker-gray">
                    Balance
                  </p>
                  <div className="flex items-end gap-x-[30px] md:gap-x-4">
                    <h1 className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                      {(chain && chain.id === fuse.id) ?
                        new Intl.NumberFormat().format(
                          parseFloat(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0")
                        ) :
                        0
                      } FUSE
                    </h1>
                    {balanceSlice.isUsdPriceLoading ?
                      <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
                      <p className="text-xl text-darker-gray">
                        ${(chain && chain.id === fuse.id) ?
                          new Intl.NumberFormat().format(
                            parseFloat((parseFloat(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0.00") * balanceSlice.price).toString())
                          ) :
                          "0.00"
                        }
                      </p>
                    }
                  </div>
                </div>
                <div className="flex gap-[52.73px] md:gap-4 justify-between">
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
                      disabledClassName="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                    >
                      <Image src={dollar} alt="dollar" />
                    </Button>
                    <p className="font-semibold whitespace-nowrap">
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
                      disabledClassName="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                      isLeft
                    >
                      <Image src={receive} alt="receive" />
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
                      disabledClassName="flex items-center justify-center w-16 h-16 bg-button-inactive text-black font-semibold rounded-full"
                      isLeft
                    >
                      <Image src={send} alt="send" />
                    </Button>
                    <p className="text-white font-semibold whitespace-nowrap">
                      Bridge
                    </p>
                  </div>
                </div>
              </div>
              {isConnected &&
                <div className="flex items-center h-[45px] md:hidden">
                  <Image
                    src={fuseIcon}
                    alt="Fuse"
                    width={45}
                    height={45}
                  />
                  <p className="text-[40px] leading-none text-white font-bold ml-[19.02px] mr-[24.12px]">
                    {address ? eclipseAddress(address) : ''}
                  </p>
                  <Copy
                    src={copy}
                    text={address ? address : ''}
                    alt="Copy"
                    width={19}
                    height={19}
                  />
                  <Image
                    src={qr}
                    alt="QR"
                    width={16}
                    height={16}
                    className="ml-[19.02px] cursor-pointer"
                    onClick={() => {
                      setIsQrModalOpen(true);
                    }}
                  />
                </div>
              }
            </div>
          </div>
          <div className="flex flex-row md:flex-col justify-between items-center gap-4 bg-lightest-gray rounded-[20px] px-[50px] pt-11 pb-9 md:px-4 md:py-6">
            <div className="flex flex-col gap-3">
              <p className="text-3xl text-black font-bold md:text-center">
                Want to run your project on Fuse?
              </p>
              <p className="text-[20px] text-text-dark-gray md:text-center">
                Become an operator to run your project
              </p>
            </div>
            <Link
              href="/build"
              className="transition ease-in-out text-lg text-white font-semibold bg-black rounded-full py-4 px-[52px] md:px-6 hover:bg-white hover:text-black"
            >
              Become an operator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
