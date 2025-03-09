import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkout, fetchOperator, selectOperatorSlice, setIsTopupAccountModalOpen, setIsWithdrawModalOpen, withRefreshToken } from "@/store/operatorSlice";
import SubMenu from "@/components/build/SubMenu";
import { selectBalanceSlice } from "@/store/balanceSlice";
import useTokenUsdBalance from "@/lib/hooks/useTokenUsdBalance";
import Info from "@/components/ui/Info";
import { getTotalTransaction, operatorInvoiceUntilTime, operatorPricing, path } from "@/lib/helpers";
import Button from "@/components/ui/Button";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import { BillingCycle, OperatorCheckoutPaymentStatus, TokenUsdBalance } from "@/lib/types";
import OperatorPricing from "@/components/build/OperatorPricing";
import OperatorInvoiceTable from "@/components/build/OperatorInvoiceTable";

type YourPlanProps = {
  balance: TokenUsdBalance;
}

const YourPlan = ({ balance }: YourPlanProps) => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const totalTransaction = getTotalTransaction(operatorSlice.operator.user.isActivated)
  const paidInvoices = operatorSlice.checkoutSessions.filter(session => session.paymentStatus === OperatorCheckoutPaymentStatus.PAID);
  const lastPaidInvoice = paidInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const prices = operatorPricing();

  function handleCheckout() {
    const origin = window?.location?.origin ?? "";
    dispatch(checkout({
      successUrl: `${origin}${path.DASHBOARD}`,
      cancelUrl: `${origin}${path.BUILD}?checkout-cancel=true`,
      billingCycle: BillingCycle.MONTHLY
    }));
  }

  return (
    <section className="grid grid-cols-4 gap-14 bg-lightest-gray rounded-[20px] p-12 md:grid-cols-1 md:p-8">
      <h3 className="text-2xl font-semibold col-span-4 md:col-span-1">
        Your Plan
      </h3>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Account balance
          <Info>
            <p>
              You can freely deposit and withdraw any tokens available on the Fuse Network.
            </p>
          </Info>
        </div>
        <div className="font-bold text-5xl leading-none whitespace-nowrap mt-1">
          {balance.token} FUSE
        </div>
        {balanceSlice.isUsdPriceLoading ?
          <span className="px-10 py-2.5 rounded-md animate-pulse bg-white/80"></span> :
          <p className="text-[1.25rem] leading-none">
            ${balance.usd}
          </p>
        }
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Current plan
        </div>
        <div className="font-bold text-5xl leading-none whitespace-nowrap mt-1">
          {operatorSlice.operator.user.isActivated ? "Basic" : "Free"} plan
        </div>
        <p className="text-[1.25rem] leading-none">
          {lastPaidInvoice ? prices[lastPaidInvoice.billingCycle].basic : 0}$ per month
        </p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Transactions
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
        <div className="font-bold text-5xl leading-none whitespace-nowrap mt-1">
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
        <div className="font-bold text-5xl leading-none whitespace-nowrap mt-1">
          Monthly
        </div>
        <p className="text-[1.25rem] leading-none">
          Until {lastPaidInvoice ?
            operatorInvoiceUntilTime(lastPaidInvoice.createdAt, lastPaidInvoice.billingCycle) :
            operatorInvoiceUntilTime(new Date().getTime(), BillingCycle.MONTHLY)
          }
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
            dispatch(setIsWithdrawModalOpen(true));
          }}
        />
      </div>
      <div className="col-start-4 col-end-4 md:col-span-1">
        <Button
          text="Upgrade plan"
          className="transition ease-in-out flex items-center gap-2 text-lg leading-none text-white font-semibold bg-black rounded-full enabled:hover:text-black enabled:hover:bg-success disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={operatorSlice.operator.user.isActivated}
          padding="py-[18.5px] px-[29.5px]"
          onClick={handleCheckout}
          isLoading={operatorSlice.isCheckingout}
        />
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

  useEffect(() => {
    dispatch(withRefreshToken(() => dispatch(fetchOperator())));
  }, [dispatch])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <WithdrawModal balance={balance.token} />
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
