import Image from "next/image";
import { useRouter } from "next/navigation";

import { path } from "@/lib/helpers";
import checkmark from "@/assets/checkmark-white.svg";
import Spinner from "../ui/Spinner";
import { useState } from "react";

export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly"
}

type BillingProps = {
  title: string;
  cycle: BillingCycle;
  selected: boolean;
  onClick: () => void;
}

type PlanProps = {
  title: string;
  description: string;
  price: number;
  features: string[];
  selectedBillingCycle: BillingCycle;
  buttonText: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  isBorder?: boolean;
  isPopular?: boolean;
};

const Billing = ({
  title,
  cycle,
  selected,
  onClick,
}: BillingProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          name="billing"
          id={cycle}
          className="appearance-none w-5 h-5 rounded-full bg-white border border-iron checked:border-[3px] checked:border-black cursor-pointer"
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
  selectedBillingCycle,
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
            Per {selectedBillingCycle === BillingCycle.YEARLY ? "year" : "month"}
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

const OperatorPricing = () => {
  const router = useRouter();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const percentageOff = selectedBillingCycle === BillingCycle.YEARLY ? 30 : 0;
  const basicPrice = 50;
  const premiumPrice = 500;
  const prices = {
    [BillingCycle.MONTHLY]: {
      free: 0,
      basic: basicPrice,
      premium: premiumPrice
    },
    [BillingCycle.YEARLY]: {
      free: 0,
      basic: basicPrice - (basicPrice * percentageOff / 100),
      premium: premiumPrice - (premiumPrice * percentageOff / 100)
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col gap-2.5 text-center">
        <h1 className="text-5xl md:text-3xl leading-tight text-fuse-black font-semibold">
          Choose a plan
        </h1>
        <p className="text-text-heading-gray max-w-md">
          Please select your proffered plan and press the “Continue” button to proceed to your account
        </p>
      </div>
      <section className="flex flex-col gap-6">
        <div className="flex justify-end items-center gap-x-6 gap-y-4 md:flex-col md:items-start">
          <Billing
            title="Monthly Billing"
            cycle={BillingCycle.MONTHLY}
            selected={selectedBillingCycle === BillingCycle.MONTHLY}
            onClick={() => setSelectedBillingCycle(BillingCycle.MONTHLY)}
          />
          <Billing
            title="Annual Billing (30% off)"
            cycle={BillingCycle.YEARLY}
            selected={selectedBillingCycle === BillingCycle.YEARLY}
            onClick={() => setSelectedBillingCycle(BillingCycle.YEARLY)}
          />
        </div>
        <article className="bg-dune rounded-[1.25rem] text-white py-10 grid grid-cols-3 md:grid-cols-1 gap-y-4">
          <Plan
            title="Free plan"
            description="Start receiving crypto payments in just a few clicks"
            price={0}
            features={["Up to 1000 monthly transactions"]}
            selectedBillingCycle={selectedBillingCycle}
            buttonText="Select"
            onClick={() => router.push(path.DASHBOARD)}
          />
          <Plan
            title="Basic plan"
            description="Robust service. Low price."
            price={prices[selectedBillingCycle].basic}
            features={["1M transactions", "Access to all services on Fuse", "Reliable and fast support"]}
            selectedBillingCycle={selectedBillingCycle}
            buttonText="Select"
            onClick={() => router.push(path.DASHBOARD)}
            isBorder
            isPopular
          />
          <Plan
            title="Premium Plan"
            description="Get more. Maximize your business potential"
            price={prices[selectedBillingCycle].premium}
            features={["Everything in the Premium plan +", "Unlimited transactions", "Individual support approach"]}
            selectedBillingCycle={selectedBillingCycle}
            buttonText="Coming soon"
            isDisabled
          />
        </article>
      </section>
    </div>
  );
};

export default OperatorPricing;
