import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { getTotalTransaction, path, subscriptionInformation } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectBalanceSlice } from "@/store/balanceSlice";
import { fetchSponsoredTransactions, fetchSponsorIdBalance, selectOperatorSlice, setIsSubscriptionModalOpen, setIsTopupAccountModalOpen, setWithdrawModal, withRefreshToken } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import RollSecretKeyModal from "@/components/dashboard/RollSecretKeyModal";
import YourSecretKeyModal from "@/components/dashboard/YourSecretKeyModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";
import { fetchTokenPrice } from "@/lib/api";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { useSearchParams } from "next/navigation";
import { Status } from "@/lib/types";
import DeveloperTools from "@/components/DeveloperTools";
import rightCaret from "@/assets/right-caret-black.svg";
import Link from "next/link";
import walletModal from "@/assets/wallet-modal.svg";
import edison from "@/assets/edison.svg";
import edisonChat from "@/assets/edison-chat.svg";
import SubMenu from "@/components/build/SubMenu";
import useTokenUsdBalance from "@/lib/hooks/useTokenUsdBalance";
import { TokenUsdBalance } from "@/lib/types";
import CheckoutSuccess from "@/components/build/CheckoutSuccess";
import OperatorNotice from "@/components/build/OperatorNotice";
import { AccountBalanceInfo, SponsoredTransactionInfo } from "@/components/build/OperatorInfo";
import useWithdrawToken from "@/lib/hooks/useWithdrawToken";

type OperatorAccountBalanceProps = {
  balance: TokenUsdBalance;
}

const OperatorAccountBalance = ({ balance }: OperatorAccountBalanceProps) => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);

  return (
    <div className="flex flex-col justify-between items-start">
      <div className="flex flex-col gap-[18px] md:mb-4">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Operator account balance
          <AccountBalanceInfo />
        </div>
        <div className="flex items-end md:flex-wrap gap-x-[30px] md:gap-x-4">
          <h1 className="font-bold text-5xl leading-none whitespace-nowrap">
            {balance.token.formatted} WFUSE
          </h1>
          {balanceSlice.isUsdPriceLoading ?
            <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
            <p className="text-[20px]/7 font-medium">
              ${balance.usd.formatted}
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
            dispatch(setWithdrawModal({
              open: true
            }));
          }}
        />
      </div>
    </div>
  )
}

const GetStarted = () => {
  return (
    <section className="flex flex-col gap-10 mt-16">
      <h2 className="text-[2.5rem] md:text-3xl leading-tight text-fuse-black font-semibold">
        Get Started
      </h2>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
        <article className="grid grid-cols-2 gap-4 bg-lightest-gray rounded-[20px] p-10 md:grid-cols-1 md:p-8">
          <div className="flex flex-col items-start gap-5">
            <div className="border border-text-dark-gray rounded-full px-4 py-2 leading-none font-medium">
              Web3 SDK
            </div>
            <h3 className="text-2xl leading-tight text-fuse-black font-bold">
              FuseBox
            </h3>
            <p>
              Make blockchain accessible to all with our Account Abstraction Infrastructure.
            </p>
            <Link
              href="https://docs.fuse.io/developers/fusebox/sdk/"
              target="_blank"
              className="group flex items-center gap-1 font-semibold"
            >
              Documentation
              <Image
                src={rightCaret}
                alt="right caret"
                width={10}
                height={20}
                className="transition ease-in-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <Image
            src={walletModal}
            alt="wallet modal"
            width={260}
            height={260}
          />
        </article>
        <article className="grid grid-cols-[0.5fr_1fr] gap-4 bg-lightest-gray rounded-[20px] p-10 md:grid-cols-1 md:p-8">
          <div className="flex flex-col items-start gap-5">
            <div className="border border-text-dark-gray rounded-full px-4 py-2 leading-none font-medium">
              Business AI agent
            </div>
            <Image
              src={edison}
              alt="edison"
              width={110}
              height={31}
              className="relative -left-2"
            />
            <p>
              Our AI agent Edison will help you build your idea from A to Z
            </p>
            <Link
              href={path.AI_AGENT}
              className="group flex items-center gap-1 font-semibold"
            >
              Try Edison
              <Image
                src={rightCaret}
                alt="right caret"
                width={10}
                height={20}
                className="transition ease-in-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <Image
            src={edisonChat}
            alt="edison chat"
            width={365}
            height={235}
          />
        </article>
      </div>
    </section>
  )
}

const Home = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const subscriptionInfo = subscriptionInformation();
  const balance = useTokenUsdBalance({
    address: operatorSlice.operator.user.smartWalletAddress,
    contractAddress: subscriptionInfo.tokenAddress
  });
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('checkout-success')
  const totalTransaction = getTotalTransaction(operatorSlice.operator.user.isActivated)
  const { isBalance } = useWithdrawToken({
    address: operatorSlice.operator.user.etherspotSmartWalletAddress
  });

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
      dispatch(withRefreshToken(() => dispatch(fetchSponsoredTransactions())));
    }
  }, [dispatch, operatorSlice.isAuthenticated])

  useEffect(() => {
    if (operatorSlice.isAuthenticated) {
      dispatch(withRefreshToken(() => dispatch(fetchSponsorIdBalance())));
    }
  }, [dispatch, operatorSlice.isAuthenticated])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <SubscriptionModal />
      <WithdrawModal />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      <div className="w-8/9 flex flex-col gap-10 mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <SubMenu selected="overview" />
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight">
            Welcome!
          </h1>
          <p className="text-[1.25rem] text-text-dark-gray">
            What are you building today?
          </p>
        </div>
        {checkoutSuccess && <CheckoutSuccess />}
        {(operatorSlice.isHydrated && !operatorSlice.operator.user.isActivated) && (
          <OperatorNotice
            title="Get access to all services on Fuse"
            onClick={() => dispatch(setIsSubscriptionModalOpen(true))}
          />
        )}
        {(operatorSlice.operator.user.etherspotSmartWalletAddress && isBalance) && (
          <OperatorNotice
            title="Migrate Operator account funds from old Etherspot to new Safe wallet"
            buttonText="Migrate"
            onClick={() => dispatch(setWithdrawModal({
              open: true,
              title: "Migrate funds",
              description: "You can migrate funds from old Etherspot to new Safe wallet",
              from: {
                title: "From old Etherspot wallet",
                address: operatorSlice.operator.user.etherspotSmartWalletAddress
              },
              to: {
                title: "To new Safe wallet",
                address: operatorSlice.operator.user.smartWalletAddress
              }
            }))}
          />
        )}
        <div className="flex flex-col gap-y-[30px] md:gap-y-[21px]">
          <div className="flex flex-row md:flex-col gap-x-4 gap-y-12 bg-lightest-gray justify-between rounded-[20px] p-12 md:p-8 min-h-[297px]">
            <OperatorAccountBalance
              balance={balance}
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
                  <SponsoredTransactionInfo />
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
        </div>
        <GetStarted />
        <DeveloperTools className="mt-16" />
        <DocumentSupport className="mt-16" />
      </div>
    </div>
  );
};

export default Home;
