import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { evmDecimals, path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BalanceStateType, fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { fuse } from "wagmi/chains";
import { fetchOperator, fetchSponsoredTransactions, fetchSponsorIdBalance, generateSecretApiKey, selectOperatorSlice, setIsRollSecretKeyModalOpen, setIsTopupAccountModalOpen, setIsWithdrawModalOpen, withRefreshToken } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import copy from "@/assets/copy-black.svg";
import roll from "@/assets/roll.svg";
import RollSecretKeyModal from "@/components/dashboard/RollSecretKeyModal";
import YourSecretKeyModal from "@/components/dashboard/YourSecretKeyModal";
import TopupPaymasterModal from "@/components/dashboard/TopupPaymasterModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import info from "@/assets/info.svg"
import Copy from "@/components/ui/Copy";
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";
import { fetchTokenPrice } from "@/lib/api";
import show from "@/assets/show.svg";
import hide from "@/assets/hide.svg";
import { formatUnits } from "viem";
import contactSupport from "@/assets/contact-support.svg";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { useSearchParams, useRouter } from "next/navigation";
import { Status } from "@/lib/types";

type OperatorAccountBalanceProps = {
  chain: any;
  balanceSlice: BalanceStateType;
  balance: any;
  dispatch: ThunkDispatch<any, undefined, AnyAction> & Dispatch<AnyAction>;
}

const OperatorAccountBalance = ({ chain, balanceSlice, balance, dispatch }: OperatorAccountBalanceProps) => {
  return (
    <div className="flex flex-col justify-between items-start">
      <div className="flex flex-col gap-[18px] md:mb-4">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Operator account balance
          <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
            ?
            <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
              <p>
                You can freely deposit and withdraw any tokens available on the Fuse Network.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end md:flex-wrap gap-x-[30px] md:gap-x-4">
          <h1 className="font-bold text-5xl leading-none whitespace-nowrap">
            {(chain && chain.id === fuse.id) ?
              new Intl.NumberFormat().format(
                parseFloat(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0")
              ) :
              0
            } FUSE
          </h1>
          {balanceSlice.isUsdPriceLoading ?
            <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
            <p className="text-[20px]/7 font-medium">
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
      <div className="flex flex-row md:flex-wrap gap-2.5">
        <Button
          text="Deposit"
          className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:text-black hover:bg-success"
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => {
            dispatch(setIsTopupAccountModalOpen(true));
          }}
        />
        <Button
          text="Withdraw"
          className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:text-black hover:bg-success"
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => {
            dispatch(setIsWithdrawModalOpen(true));
          }}
        />
      </div>
    </div>
  )
}

const Home = () => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const controller = useMemo(() => new AbortController(), []);
  const { isConnected, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address: operatorSlice.operator.user.smartWalletAddress,
    chainId: fuse.id,
  });
  const router = useRouter();
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('checkout-success')
  const totalTransaction = operatorSlice.operator.user.isActivated ? 1_000_000 : 1000;

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
    dispatch(fetchSponsorIdBalance());
  }, [operatorSlice.isHydrated, operatorSlice.isFundingPaymaster, operatorSlice.isCreatingPaymaster, dispatch])

  useEffect(() => {
    (async () => {
      if (operatorSlice.withdrawStatus === Status.SUCCESS && operatorSlice.withdraw.amount) {
        const priceUSD = await fetchTokenPrice(operatorSlice.withdraw.coinGeckoId);
        const amountUSD = parseFloat(operatorSlice.withdraw.amount) * (typeof priceUSD === "string" ? parseFloat(priceUSD) : priceUSD);

        amplitude.track("Account Balance Withdrawn", {
          amount: operatorSlice.withdraw.amount,
          amountUSD,
          token: operatorSlice.withdraw.token
        });
      }
    })();
  }, [operatorSlice.withdrawStatus, operatorSlice.withdraw.amount, operatorSlice.withdraw.coinGeckoId, operatorSlice.withdraw.token])

  useEffect(() => {
    if (operatorSlice.isAuthenticated) {
      refetch();
    }
  }, [blockNumber, operatorSlice.isAuthenticated, refetch])

  useEffect(() => {
    dispatch(withRefreshToken(() => dispatch(fetchOperator())));
  }, [dispatch])

  useEffect(() => {
    if (operatorSlice.isAuthenticated) {
      dispatch(withRefreshToken(() => dispatch(fetchSponsoredTransactions())));
    }
  }, [dispatch, operatorSlice.isAuthenticated])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <SubscriptionModal />
      <WithdrawModal balance={formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0"} />
      <TopupPaymasterModal balance={formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0"} />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <div className="flex justify-between md:flex-col gap-2 mt-[66.29px] mb-[50px] md:mt-14">
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight md:text-center">
            Operator Dashboard
          </h1>
          <div className="flex items-center gap-px md:hidden">
            <Image
              src={contactSupport}
              alt="contact support"
            />
            <div className="flex items-center gap-1">
              <p>
                Not sure what&apos;s next?
              </p>
              <button
                className="underline font-bold"
                onClick={() => {
                  amplitude.track("Contact us - Operators");
                  window.open("https://calendly.com/magali-fuse", "_blank");
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
        {checkoutSuccess && (
          <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2 bg-success rounded-[20px] px-[30px] py-[18px] mb-[30px] border-[0.5px] border-star-dust-alpha-70">
            <Image
              src={info}
              alt="info"
              width={32}
              height={32}
            />
            <p className="font-medium">
              Congratulations! your operator account basic plan is active
            </p>
          </div>
        )}
        {!operatorSlice.operator.user.isActivated &&
          <div className="flex flex-row md:flex-col gap-4 justify-between items-center bg-lemon-chiffon rounded-[20px] px-[30px] py-[18px] mb-[30px] border-[0.5px] border-star-dust-alpha-70">
            <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2">
              <Image
                src={info}
                alt="info"
                width={32}
                height={32}
              />
              <p className="font-medium">
                Get access to all services on Fuse
              </p>
            </div>
            <Button
              text="Upgrade"
              className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black hover:text-black hover:bg-white rounded-full"
              padding="py-3.5 px-[38px]"
              onClick={() => {
                router.push(path.BUILD)
              }}
            />
          </div>
        }
        <div className="flex flex-col gap-y-[30px] md:gap-y-[21px] mb-[143.32px] md:mb-[66px]">
          <div className="flex flex-row md:flex-col gap-x-4 gap-y-12 bg-lightest-gray justify-between rounded-[20px] p-12 md:p-8 min-h-[297px]">
            <OperatorAccountBalance
              chain={chain}
              balanceSlice={balanceSlice}
              balance={balance}
              dispatch={dispatch}
            />
            <div className="flex flex-col justify-between w-[361px] md:w-auto">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray font-medium">
                  Active plan
                </p>
                <p className="font-bold text-5xl leading-none whitespace-nowrap">
                  {operatorSlice.operator.user.isActivated ? 'Basic' : 'Free'} plan
                </p>
              </div>
              <div className="flex flex-col gap-[18px] w-full md:mt-[30px]">
                <div className="flex items-center gap-2.5 text-lg text-text-dark-gray font-medium">
                  Sponsored Transactions
                  <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                    ?
                    <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                      <p className="mb-1">
                        Sponsored transactions are a feature that allows you to pay for your customers gas fees.
                      </p>
                      <p>
                        Since the gas cost in the Fuse Network is very low, your customers will not have to solve
                        the gas issue on their own, you can easily take on these very small costs yourself.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10.5px]">
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat().format(operatorSlice.sponsoredTransactions)}/{new Intl.NumberFormat().format(totalTransaction)}
                  </p>
                  <div className="bg-[#BBBBBB] h-2.5 rounded-full">
                    <div
                      className="bg-success h-2.5 rounded-full"
                      style={{ width: ((operatorSlice.sponsoredTransactions) / totalTransaction) * 100 + "%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:flex-col gap-[30px] md:gap-5">
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] pl-12 pt-12 pr-4 pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px] bg-black">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-bold text-white">
                  Send your first transaction
                </p>
                <p className="text-base text-white">
                  Learn how to submit your first transaction using a smart contract wallet
                </p>
              </div>
              <button
                className="transition ease-in-out text-black leading-none font-semibold bg-modal-bg rounded-full px-7 py-4 hover:bg-success"
                onClick={() => {
                  amplitude.track("Go to Tutorials");
                  window.open("https://docs.fuse.io/developers/tutorials/send-your-first-gasless-transaction", "_blank");
                }}
              >
                Start tutorial
              </button>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-[20px] leading-none font-semibold">
                    Your API Key
                  </p>
                  <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                    ?
                    <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                      <p>
                        The Fuse Network&apos;s low cost allows for testing with the production API key.
                        For sandbox API key tests on the Spark network, reach out via chat for assistance.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API key at the next stage for integration into the SDK
                </p>
              </div>
              <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                <p>
                  {operatorSlice.operator.project.publicKey}
                </p>
                <Copy
                  src={copy}
                  text={operatorSlice.operator.project.publicKey}
                  tooltipText="API Key copied"
                  alt="copy API key"
                  width={15}
                  height={15}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Your API secret key
                </p>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API secret key for some FuseBox APIs.
                </p>
              </div>
              {operatorSlice.operator.project.secretLastFourChars ?
                <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-xs text-black font-semibold px-5 py-[15px]">
                  {operatorSlice.operator.project.secretKey && showSecretKey ?
                    <p>
                      {operatorSlice.operator.project.secretKey}
                    </p> :
                    <p>
                      {operatorSlice.operator.project.secretPrefix}{new Array(20).fill("*")}{operatorSlice.operator.project.secretLastFourChars}
                    </p>
                  }
                  <div className="flex items-center gap-2">
                    {operatorSlice.operator.project.secretKey &&
                      <Image
                        src={showSecretKey ? show : hide}
                        alt="display secret key"
                        width={20}
                        height={20}
                        title="Display Secret Key"
                        className="cursor-pointer"
                        onClick={() => {
                          setShowSecretKey(!showSecretKey)
                        }}
                      />
                    }
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
                  </div>
                </div> :
                <Button
                  text="Generate a new API secret"
                  className="transition ease-in-out flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
                  padding="py-4 px-6"
                  onClick={() => {
                    dispatch(withRefreshToken(() => dispatch(generateSecretApiKey())));
                  }}
                >
                  {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                </Button>
              }
            </div>
          </div>
        </div>
        <DocumentSupport />
      </div>
    </div>
  );
};

export default Home;
