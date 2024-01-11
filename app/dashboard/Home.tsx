import { useEffect } from "react";
import Button from "@/components/ui/Button";
import rightArrow from "@/assets/right-arrow.svg"
import { eclipseAddress, hex, walletType } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { fuse } from "wagmi/chains";
import * as amplitude from "@amplitude/analytics-browser";
import Link from "next/link";
import { selectOperatorSlice, setIsTopupAccountModalOpen } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import copy from "@/assets/copy-black.svg"

const Home = () => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const controller = new AbortController();
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({
    address: operatorSlice.operator.user.smartContractAccountAddress,
    watch: operatorSlice.operator.user.smartContractAccountAddress !== hex,
    chainId: fuse.id,
  });
  const transaction = 1000;
  const totalTransaction = 1000;

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
      <TopupAccountModal />
      <div className="w-8/9 flex flex-col gap-y-[32.98px] mt-16 mb-[187px] md:w-9/10 max-w-7xl">
        <div>
          <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-col gap-y-[30px]">
          <div className="bg-fuse-black rounded-[20px] text-white px-12 md:px-8 py-14 md:py-10">
            <div className="flex flex-row justify-between md:flex-col gap-12">
              <div className="flex flex-col gap-y-[62px]">
                <div className="flex flex-col gap-y-[18px]">
                  <div className="flex gap-4">
                    <p className="text-lg text-darker-gray">
                      Operator account balance
                    </p>
                    <p className="text-white font-bold">
                      ({eclipseAddress(String(operatorSlice.operator.user.smartContractAccountAddress))})
                    </p>
                  </div>
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
                            parseFloat((parseFloat(balance.data?.formatted ?? "0.00") * balanceSlice.price).toString())
                          ) :
                          "0.00"
                        }
                      </p>
                    }
                  </div>
                </div>
                <div>
                  <Button
                    text="Topup account"
                    className="text-black font-semibold bg-success rounded-full"
                    padding="py-[19.5px] px-[46px]"
                    onClick={() => {
                      dispatch(setIsTopupAccountModalOpen(true));
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between w-full max-w-[535px]">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-[18px]">
                    <p className="text-lg text-darker-gray">
                      Active plan
                    </p>
                    <p className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                      Free
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg text-darker-gray">
                      Transactions
                    </p>
                    <p className="text-lg text-darker-gray">
                      {transaction}/{totalTransaction}
                    </p>
                  </div>
                  <div className="bg-[#474747] h-2.5 rounded-full">
                    <div
                      className="bg-success h-2.5 rounded-full"
                      style={{ width: (transaction / totalTransaction) * 100 + "%" }}
                    ></div>
                  </div>
                </div>
              </div>
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
                  Your API Key
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  You will need this API key at the next stage for integration into the SDK
                </p>
              </div>
              <div className="w-full flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                <p>
                  {operatorSlice.operator.project.publicKey}
                </p>
                <Image
                  src={copy.src}
                  alt="copy API key"
                  width={15}
                  height={15}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(operatorSlice.operator.project.publicKey);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-3 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Learn what you can do
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  The Operator&apos;s account is a single information and control panel for Operators.
                </p>
              </div>
              <div className="flex gap-8">
                <Link href={"#"} className="group flex gap-1 text-black font-semibold">
                  <p>Learn more</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
