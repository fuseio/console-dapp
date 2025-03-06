import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { getTotalTransaction, path } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectBalanceSlice } from "@/store/balanceSlice";
import { fetchOperator, fetchSponsoredTransactions, selectOperatorSlice, setIsTopupAccountModalOpen, setIsWithdrawModalOpen, withRefreshToken } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import RollSecretKeyModal from "@/components/dashboard/RollSecretKeyModal";
import YourSecretKeyModal from "@/components/dashboard/YourSecretKeyModal";
import TopupPaymasterModal from "@/components/dashboard/TopupPaymasterModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import info from "@/assets/info.svg"
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";
import { fetchTokenPrice } from "@/lib/api";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { useSearchParams, useRouter } from "next/navigation";
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
import Info from "@/components/ui/Info";

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
          <Info>
            <p>
              You can freely deposit and withdraw any tokens available on the Fuse Network.
            </p>
          </Info>
        </div>
        <div className="flex items-end md:flex-wrap gap-x-[30px] md:gap-x-4">
          <h1 className="font-bold text-5xl leading-none whitespace-nowrap">
            {balance.token} FUSE
          </h1>
          {balanceSlice.isUsdPriceLoading ?
            <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
            <p className="text-[20px]/7 font-medium">
              ${balance.usd}
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

const GetStarted = () => {
  return (
    <section className="flex flex-col gap-10">
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
              href="https://docs.fuse.io/developers/fusebox"
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
              href="https://www.fuse.io/edison#waitlist"
              target="_blank"
              className="group flex items-center gap-1 font-semibold"
            >
              Join the waitlist
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
  const balance = useTokenUsdBalance({
    address: operatorSlice.operator.user.smartWalletAddress,
  });
  const router = useRouter();
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('checkout-success')
  const totalTransaction = getTotalTransaction(operatorSlice.operator.user.isActivated)

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
      <WithdrawModal balance={balance.token} />
      <TopupPaymasterModal balance={balance.token} />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <SubMenu selected="overview" />
        <div className="flex flex-col gap-4 mt-14 mb-10">
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight">
            Welcome!
          </h1>
          <p className="text-[1.25rem] text-text-dark-gray">
            What are you building today?
          </p>
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
                  <Info>
                    <p className="mb-1">
                      Sponsored transactions are a feature that allows you to pay for your customers gas fees.
                    </p>
                    <p>
                      Since the gas cost in the Fuse Network is very low, your customers will not have to solve
                      the gas issue on their own, you can easily take on these very small costs yourself.
                    </p>
                  </Info>
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
        <div className="flex flex-col gap-28 mt-28 md:gap-20 md:mt-20">
          <GetStarted />
          <DeveloperTools />
          <DocumentSupport />
        </div>
      </div>
    </div>
  );
};

export default Home;
