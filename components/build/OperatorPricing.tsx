import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { cn, operatorLastInvoice, operatorPricing, path } from "@/lib/helpers";
import checkmark from "@/assets/checkmark-white.svg";
import Spinner from "../ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectOperatorSlice, setIsSubscriptionModalOpen } from "@/store/operatorSlice";
import { BillingCycle, OperatorRegistrationClassNames } from "@/lib/types";

type BillingProps = {
  title: string;
  cycle: BillingCycle;
  selected: boolean;
  onClick: () => void;
  classNames?: OperatorRegistrationClassNames;
}

type PlanProps = {
  title: string;
  description: string;
  price: number;
  features: string[];
  buttonText: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  isBorder?: boolean;
  isPopular?: boolean;
};

type OperatorPricing = {
  classNames?: OperatorRegistrationClassNames;
  isHeader?: boolean;
  isOperator?: boolean;
}

const Billing = ({
  title,
  cycle,
  selected,
  onClick,
  classNames
}: BillingProps) => {
  return (
    <div className={cn("flex items-center gap-2", classNames?.pricingBilling)}>
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          name="billing"
          id={cycle}
          className={cn("appearance-none w-5 h-5 rounded-full bg-white border border-iron checked:border-[3px] checked:border-black cursor-pointer", classNames?.pricingBillingRadio)}
          checked={selected}
          onChange={onClick}
        />
        <div className="absolute inset-0 pointer-events-none"></div>
      </div>
      <label htmlFor={cycle} className="cursor-pointer">{title}</label>
    </div>
  )
}
const Plan = ({
  title,
  description,
  price,
  features,
  buttonText,
  onClick,
  isLoading,
  isDisabled,
  isBorder,
  isPopular,
}: PlanProps) => {
  return (
    <div className={`flex flex-col gap-6 p-10 min-h-[540px] rounded-[1.25rem] ${isBorder ? "border border-white" : ""}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-5">
          <h2 className="text-3xl font-semibold md:text-2xl">
            {title}
          </h2>
          {isPopular && (
            <div className="border-2 border-white rounded-full px-3 py-1.5 font-semibold leading-none">
              Popular
            </div>
          )}
        </div>
        <p className="text-white/60 h-10">
          {description}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-[3.125rem] font-semibold">
            ${price}
          </span>
          <span className="text-white/60">
            Per month
          </span>
        </div>
      </div>
      <hr className="w-full h-[0.5px] border-dove-gray" />
      <div className="flex flex-col gap-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <Image src={checkmark} alt="checkmark" width={16} height={11} />
            <p>
              {feature}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onClick}
        className="transition ease-in-out flex items-center justify-center gap-2 mt-auto px-10 py-3 bg-success border enabled:border-success rounded-full text-lg leading-none text-black font-semibold hover:bg-[transparent] hover:text-success disabled:bg-iron disabled:border-iron disabled:text-white"
        disabled={isDisabled}
      >
        {buttonText}
        {isLoading && <Spinner />}
      </button>
    </div>
  )
}

const OperatorPricing = ({
  classNames,
  isHeader = false,
  isOperator = false
}: OperatorPricing) => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const router = useRouter();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const prices = operatorPricing();
  const isActivated = operatorSlice.operator.user.isActivated
  const lastInvoice = operatorLastInvoice(operatorSlice.subscriptionInvoices);
  const isBillingSwitch = false;

  return (
    <div className="flex flex-col items-center gap-10">
      {isHeader && (
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-5xl md:text-3xl leading-tight text-fuse-black font-semibold">
            Choose a plan
          </h1>
          <p className="text-text-heading-gray max-w-md">
            Please select your proffered plan and press the “Continue” button to proceed to your account
          </p>
        </div>
      )}
      <section className={cn("flex flex-col", classNames?.pricingSection)}>
        {isBillingSwitch && (
          <div className={cn("flex justify-end items-center gap-x-6 gap-y-4 md:flex-col md:items-start", classNames?.pricingBillingContainer)}>
            <Billing
              title="Monthly Billing"
              cycle={BillingCycle.MONTHLY}
              selected={selectedBillingCycle === BillingCycle.MONTHLY}
              onClick={() => setSelectedBillingCycle(BillingCycle.MONTHLY)}
              classNames={classNames}
            />
            <Billing
              title="Annual Billing (30% off)"
              cycle={BillingCycle.YEARLY}
              selected={selectedBillingCycle === BillingCycle.YEARLY}
              onClick={() => setSelectedBillingCycle(BillingCycle.YEARLY)}
              classNames={classNames}
            />
          </div>
        )}
        <article className={cn(
          "bg-dune rounded-[1.25rem] text-white py-10 md:py-0 grid grid-cols-3 md:grid-cols-1 gap-y-4",
          classNames?.pricingArticle
        )}>
          <Plan
            title="Free plan"
            description="Start receiving crypto payments in just a few clicks"
            price={0}
            features={["Up to 1000 monthly transactions", "1M RPC calls", "10K API calls", "10K Webhook calls"]}
            buttonText={isActivated ? "Free plan" : isOperator ? "Current plan" : "Select"}
            onClick={() => router.push(path.DASHBOARD)}
            isDisabled={isOperator}
          />
          <Plan
            title="Basic plan"
            description="Robust service. Low price."
            price={prices[selectedBillingCycle].basic}
            features={["1M transactions", "Unlimited RPC calls", "1M API calls", "1M Webhook calls", "Access to all services on Fuse", "Reliable and fast support"]}
            buttonText={lastInvoice.valid ? "Current plan" : isOperator ? "Upgrade" : "Select"}
            onClick={() => dispatch(setIsSubscriptionModalOpen(true))}
            isLoading={operatorSlice.isCheckingout}
            isBorder
            isPopular
            isDisabled={isOperator && lastInvoice.valid}
          />
          <Plan
            title="Premium Plan"
            description="Get more. Maximize your business potential"
            price={prices[selectedBillingCycle].premium}
            features={["Everything in the Basic plan +", "Unlimited transactions", "Unlimited API calls and Webhook calls", "Individual support approach"]}
            buttonText="Coming soon"
            isDisabled
          />
        </article>
        <footer className="text-end text-sm text-white/60 px-10 pb-4">
          <ul>
            <li>
              <p>
                * Billed 1st day of the month
              </p>
            </li>
            <li>
              <p>
                ** Prorated billing applied
              </p>
            </li>
          </ul>
        </footer>
      </section>
    </div>
  );
};

export default OperatorPricing;
