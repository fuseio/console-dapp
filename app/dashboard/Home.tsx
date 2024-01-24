import { useEffect } from "react";
import Button from "@/components/ui/Button";
import rightArrow from "@/assets/right-arrow.svg"
import { buildSubMenuItems } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { fuse } from "wagmi/chains";
import Link from "next/link";
import { createPaymaster, fetchSponsorIdBalance, generateSecretApiKey, selectOperatorSlice, setIsRollSecretKeyModalOpen, setIsTopupAccountModalOpen, setIsTopupPaymasterModalOpen } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import copy from "@/assets/copy-black.svg";
import NavMenu from "@/components/NavMenu";
import roll from "@/assets/roll.svg";
import RollSecretKeyModal from "@/components/dashboard/RollSecretKeyModal";
import YourSecretKeyModal from "@/components/dashboard/YourSecretKeyModal";
import TopupPaymasterModal from "@/components/dashboard/TopupPaymasterModal";

const Home = () => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const controller = new AbortController();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({
    address: operatorSlice.operator.user.smartContractAccountAddress,
    watch: operatorSlice.isAuthenticated,
    chainId: fuse.id,
  });
  const transaction = 0;
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

  useEffect(() => {
    dispatch(fetchSponsorIdBalance());
  }, [operatorSlice.isHydrated, operatorSlice.isFundingPaymaster, operatorSlice.isCreatingPaymaster])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <TopupPaymasterModal balance={balance.data?.formatted ?? "0"} />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[187px] md:w-9/10 max-w-7xl">
        <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="dashboard" className="" />
        <div className="mt-[76.29px] mb-[70px]">
          <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
            Operator Dashboard
          </h1>
        </div>
        <div className="flex flex-col gap-y-[30px]">
          <div className="flex flex-row gap-4 bg-lightest-gray justify-between md:flex-col rounded-[20px] p-12 md:p-8 min-h-[297px]">
            <div className="flex flex-col justify-between items-start">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray">
                  Operator account balance
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
                    <p className="text-[20px]/7 font-medium">
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
              <Button
                text="Deposit funds"
                className="text-black text-white font-semibold bg-black rounded-full"
                padding="py-4 px-[52px]"
                onClick={() => {
                  dispatch(setIsTopupAccountModalOpen(true));
                }}
              />
            </div>
            <div className="flex flex-col justify-between items-start">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray">
                  Paymaster balance
                </p>
                <div className="flex items-end gap-x-[30px] md:gap-x-4">
                  {operatorSlice.isFetchingSponsorIdBalance ?
                    <span className="px-14 py-4 ml-2 rounded-md animate-pulse bg-white/80"></span> :
                    <h1 className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                      {new Intl.NumberFormat().format(Number(operatorSlice.sponsorIdBalance))} FUSE
                    </h1>
                  }
                </div>
              </div>
              {operatorSlice.operator.project.sponsorId ?
                <Button
                  text="Top-up Paymaster"
                  className="text-black text-white font-semibold bg-black rounded-full"
                  padding="py-4 px-[52px]"
                  onClick={() => {
                    dispatch(setIsTopupPaymasterModalOpen(true));
                  }}
                /> :
                <Button
                  text="Create a paymaster"
                  className="flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full"
                  padding="py-4 px-6"
                  onClick={() => {
                    dispatch(createPaymaster());
                  }}
                >
                  {operatorSlice.isCreatingPaymaster && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                </Button>
              }
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray">
                  Active plan
                </p>
                <p className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                  Free plan
                </p>
              </div>
              <div className="flex flex-col gap-[18px] w-[361px] md:w-full">
                <p className="text-lg text-text-dark-gray">
                  Transactions
                </p>
                <div className="flex flex-col gap-[10.5px]">
                  <div className="flex justify-between">
                    <p className="text-lg font-bold">{new Intl.NumberFormat().format(transaction)}</p>
                    <p className="text-lg font-bold">{new Intl.NumberFormat().format(totalTransaction)}</p>
                  </div>
                  <div className="bg-[#BBBBBB] h-2.5 rounded-full">
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
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Your API Key
                </p>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API key at the next stage for integration into the SDK
                </p>
              </div>
              <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                <p>
                  {operatorSlice.operator.project.publicKey}
                </p>
                <Image
                  src={copy}
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
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Your API secret key
                </p>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API secret key for some FuseBox APIs.
                </p>
              </div>
              {operatorSlice.operator.project.secretKey ?
                <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                  <p>
                    {operatorSlice.operator.project.secretKey}
                  </p>
                  <Image
                    src={roll}
                    alt="roll secret key"
                    width={15}
                    height={15}
                    title="Roll Secret Key"
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setIsRollSecretKeyModalOpen(true));
                    }}
                  />
                </div> : operatorSlice.operator.project.secretLastFourChars ?
                  <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                    <p>
                      {operatorSlice.operator.project.secretPrefix}{new Array(20).fill("*")}{operatorSlice.operator.project.secretLastFourChars}
                    </p>
                    <Image
                      src={roll}
                      alt="roll secret key"
                      width={15}
                      height={15}
                      title="Roll Secret Key"
                      className="cursor-pointer"
                      onClick={() => {
                        dispatch(setIsRollSecretKeyModalOpen(true));
                      }}
                    />
                  </div> :
                  <Button
                    text="Generate a new API secret"
                    className="flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full"
                    padding="py-4 px-6"
                    onClick={() => {
                      dispatch(generateSecretApiKey());
                    }}
                  >
                    {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                  </Button>
              }
            </div>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Learn what you can do
                </p>
                <p className="text-text-dark-gray md:text-base">
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
