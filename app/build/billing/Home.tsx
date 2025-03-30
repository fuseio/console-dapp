import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchOperator, selectOperatorSlice, setIsSubscriptionModalOpen, setIsTopupAccountModalOpen, setWithdrawModal, withRefreshToken } from "@/store/operatorSlice";
import SubMenu from "@/components/build/SubMenu";
import { selectBalanceSlice } from "@/store/balanceSlice";
import useTokenUsdBalance from "@/lib/hooks/useTokenUsdBalance";
import { getTotalTransaction, operatorInvoiceUntilTime, operatorLastInvoice, operatorPricing, subscriptionInformation } from "@/lib/helpers";
import Button from "@/components/ui/Button";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import { BillingCycle, TokenUsdBalance } from "@/lib/types";
import OperatorPricing from "@/components/build/OperatorPricing";
import OperatorInvoiceTable from "@/components/build/OperatorInvoiceTable";
import OperatorNotice from "@/components/build/OperatorNotice";
import { AccountBalanceInfo, SponsoredTransactionInfo } from "@/components/build/OperatorInfo";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { useWalletClient } from "wagmi";

type YourPlanProps = {
  balance: TokenUsdBalance;
}

const YourPlan = ({ balance }: YourPlanProps) => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const totalTransaction = getTotalTransaction(operatorSlice.operator.user.isActivated)
  const lastInvoice = operatorLastInvoice(operatorSlice.subscriptionInvoices);
  const prices = operatorPricing();
  const numberFormat = new Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });

  return (
    <section className="grid grid-cols-4 gap-14 bg-lightest-gray rounded-[20px] p-12 md:grid-cols-1 md:p-8">
      <h3 className="text-2xl font-semibold col-span-4 md:col-span-1">
        Your Plan
      </h3>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Account balance
          <AccountBalanceInfo />
        </div>
        <div className="font-bold text-4xl leading-none whitespace-nowrap mt-1">
          {numberFormat.format(balance.token.value)} WFUSE
        </div>
        {balanceSlice.isUsdPriceLoading ?
          <span className="px-10 py-2.5 rounded-md animate-pulse bg-white/80"></span> :
          <p className="text-[1.25rem] leading-none">
            ${balance.usd.formatted}
          </p>
        }
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Current plan
        </div>
        <div className="font-bold text-4xl leading-none whitespace-nowrap mt-1">
          {operatorSlice.operator.user.isActivated ? "Basic" : "Free"} plan
        </div>
        <p className="text-[1.25rem] leading-none">
          {lastInvoice.paid ? prices[BillingCycle.MONTHLY].basic : 0}$ per month
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Transactions
          <SponsoredTransactionInfo />
        </div>
        <div className="font-bold text-4xl leading-none whitespace-nowrap mt-1">
          {new Intl.NumberFormat().format(totalTransaction)}
        </div>
        <p className="text-[1.25rem] leading-none">
          per month
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Billing cycle
        </div>
        <div className="font-bold text-4xl leading-none whitespace-nowrap mt-1">
          Monthly
        </div>
        <p className="text-[1.25rem] leading-none">
          Until {operatorInvoiceUntilTime(lastInvoice.paid?.createdAt ?? new Date().getTime(), BillingCycle.MONTHLY).toLocaleDateString('en-GB')}
        </p>
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
          className="transition ease-in-out text-lg leading-none text-black font-semibold bg-[transparent] rounded-full hover:bg-success"
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => {
            dispatch(setWithdrawModal({
              open: true
            }));
          }}
        />
      </div>
      <div className="col-start-4 col-end-4 md:col-span-1">
        <Button
          text="Upgrade plan"
          className="transition ease-in-out flex items-center gap-2 text-lg leading-none text-white font-semibold bg-black rounded-full enabled:hover:text-black enabled:hover:bg-success disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={lastInvoice.valid}
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => dispatch(setIsSubscriptionModalOpen(true))}
          isLoading={operatorSlice.isCheckingout}
        />
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
  const lastInvoice = operatorLastInvoice(operatorSlice.subscriptionInvoices);
  const walletClient = useWalletClient()

  useEffect(() => {
    dispatch(withRefreshToken(() => dispatch(fetchOperator({ account: walletClient.data?.account }))));
  }, [dispatch, walletClient.data?.account])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <WithdrawModal />
      <SubscriptionModal />
      <div className="w-8/9 flex flex-col gap-10 mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <SubMenu selected="billing & usage" />
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight">
            Welcome!
          </h1>
          <p className="text-[1.25rem] text-text-dark-gray">
            What are you building today?
          </p>
        </div>
        {(operatorSlice.operator.user.isActivated && !lastInvoice.valid) && (
          <OperatorNotice
            title="Subscription allowance has been consumed, please recharge your plan"
            onClick={() => dispatch(setIsSubscriptionModalOpen(true))}
          />
        )}
        <YourPlan balance={balance} />
        <OperatorInvoiceTable />
        <OperatorPricing
          classNames={{
            pricingSection: "bg-dune rounded-[1.25rem]",
            pricingBillingContainer: "pt-10 px-10",
            pricingBilling: "text-white",
            pricingBillingRadio: "bg-text-dark-gray border-text-dark-gray checked:bg-[transparent] checked:border-white"
          }}
          isOperator={true}
        />
      </div>
    </div>
  );
};

export default Home;
