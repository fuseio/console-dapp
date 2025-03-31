import Link from "next/link";
import Image from "next/image";
import { Check, Plus, Minus, ChevronRight } from "lucide-react";
import { FormikProps, useFormik } from "formik";
import * as Yup from 'yup';

import { cn, compactNumberFormat } from "@/lib/helpers";
import { coins } from "@/lib/hooks/useWithdrawToken";
import CheckConnectionWrapper from "@/components/CheckConnectionWrapper";

import fuseToken from "@/assets/fuseToken.svg";
import usdc from "@/assets/usdc.svg";
import walletGray from "@/assets/wallet-gray.svg";
import ember from "@/assets/ember.png";

type NodeDetailProps = {
  tierId: number;
  classNames?: {
    article?: string;
    badge?: string;
    content?: string;
  };
  style?: React.CSSProperties;
}

const availableCoinSymbols = ["USDC", "USDT"] as const;
type AvailableCoinSymbol = typeof availableCoinSymbols[number];
type AvailableCoins = {
  [key in AvailableCoinSymbol]: typeof coins[key];
}

type BuyNodeFormValues = {
  token: AvailableCoinSymbol;
  quantity: number;
}

type BuyNodeProps = {
  formik: FormikProps<BuyNodeFormValues>;
}

type SelectProps = {
  formik: FormikProps<BuyNodeFormValues>;
  token: AvailableCoinSymbol;
}

type InputProps = {
  formik: FormikProps<BuyNodeFormValues>;
}

const tiers = [
  {
    allocation: 2000,
    price: 350
  },
  {
    allocation: 1300,
    price: 600
  },
  {
    allocation: 1250,
    price: 850
  },
  {
    allocation: 1125,
    price: 1000
  },
  {
    allocation: 1100,
    price: 1250
  },
  {
    allocation: 1075,
    price: 1500
  },
  {
    allocation: 1065,
    price: 1750
  },
  {
    allocation: 1055,
    price: 2000
  },
  {
    allocation: 1030,
    price: 2250
  },
  {
    allocation: 1000,
    price: 2500
  },
]

const currentTier = {
  id: 4,
  sold: 66
}

const availableNodes = tiers[currentTier.id - 1].allocation - currentTier.sold;

const availableCoins = Object.entries(coins).reduce((acc, [symbol, coin]) => {
  if (availableCoinSymbols.includes(symbol as AvailableCoinSymbol)) {
    acc[symbol as AvailableCoinSymbol] = coin;
  }
  return acc;
}, {} as AvailableCoins);

const Header = () => {
  return (
    <header>
      <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
        Buy Node
      </h1>
    </header>
  );
};

const NodeDetail = ({ tierId, classNames, style }: NodeDetailProps) => {
  const soldPercentage = currentTier.sold / tiers[tierId - 1].allocation * 100;

  return (
    <article
      className={cn("flex flex-col gap-1 bg-white rounded-[1.25rem]",
        tierId === currentTier.id && "border-2 border-vivid-green",
        classNames?.article
      )}
      style={style}
    >
      <div className={cn("w-fit bg-success-light rounded-ss-[1.125rem] rounded-ee-[1.125rem] px-6 py-2.5 text-success-dark font-medium",
        classNames?.badge
      )}>
        {tierId === currentTier.id ? "Ongoing Tier" : "Coming soon Tier"} {tierId}
      </div>
      <div className={cn("flex flex-col gap-5 px-5 pb-7",
        classNames?.content
      )}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-lg text-text-dark-gray font-medium">
              Unit Price
            </div>
            {tierId === currentTier.id ? (
              <div className="flex items-center gap-2">
                <Image src={usdc} alt="usdc" width={24} height={24} />
                <span className="text-5xl font-semibold md:text-2xl">
                  {tiers[tierId - 1].price}
                </span>
                <span className="text-lg text-text-dark-gray font-medium">
                  USDC
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-5xl font-semibold md:text-2xl">
                  {tiers[tierId - 1].price}
                </span>
                <span className="text-lg text-text-dark-gray font-medium">
                  USD
                </span>
              </div>
            )}
          </div>
          {tierId === currentTier.id && (
            <div className="flex justify-end items-center gap-1">
              <div className="text-[1.25rem] font-semibold">
                {tiers[tierId - 1].price}
              </div>
              <div className="text-lg text-text-dark-gray font-medium">
                USD
              </div>
            </div>
          )}
        </div>
        {tierId === currentTier.id && (
          <div className="relative h-2.5 bg-light-gray rounded-full">
            <div
              className="absolute h-full bg-success rounded-full"
              style={{
                width: `${soldPercentage}%`
              }}
            >
              <div className="absolute w-6 h-6 top-1/2 right-0 translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-pale-green rounded-full shadow-md">
                <Check className="text-black" size={16} />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          {tierId === currentTier.id ? (
            <div className="flex items-center gap-1">
              <span className="text-[1.25rem] font-semibold">
                {currentTier.sold}
              </span>
              <span className="text-lg text-text-dark-gray font-medium">
                / {tiers[tierId - 1].allocation} Sold
              </span>
            </div>
          ) : (
            <div>
              Nodes Available
            </div>
          )}
          {tierId === currentTier.id ? (
            <span className="text-[1.25rem] font-semibold">
              {soldPercentage.toFixed(2)}%
            </span>
          ) : (
            <div>
              {tiers[tierId - 1].allocation}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const Select = ({ formik, token }: SelectProps) => {
  const balance = 30000.56;
  return (
    <button
      type="button"
      className={cn("relative flex items-center gap-5 bg-light-gray border-2 border-[transparent] rounded-lg px-6 py-3 md:px-4 md:py-2",
        formik.values.token === token && "border-vivid-green"
      )}
      onClick={() => formik.setFieldValue("token", token)}
    >
      <div className="flex items-center gap-2">
        <Image src={availableCoins[token].icon} alt={availableCoins[token].name} width={24} height={24} />
        <span className="text-2xl font-medium md:text-base">{token}</span>
      </div>
      <div className="flex items-center gap-2">
        <Image src={walletGray} alt="wallet" width={16} height={16} />
        <span className="text-lg text-text-dark-gray font-medium">{compactNumberFormat.format(balance)}</span>
      </div>
      {formik.values.token === token && (
        <div className="absolute w-6 h-6 -top-2.5 -right-2.5 flex justify-center items-center bg-success-light rounded-full shadow-md">
          <Check className="text-success-dark" size={16} />
        </div>
      )}
    </button>
  );
};

const Input = ({ formik }: InputProps) => {
  return (
    <div className="flex items-center bg-light-gray rounded-lg">
      <button
        type="button"
        className="p-3 hover:bg-dark-gray rounded-l-lg transition-colors"
        onClick={() => formik.setFieldValue("quantity", Math.max(1, formik.values.quantity - 1))}
      >
        <Minus className="text-text-dark-gray" size={20} />
      </button>
      <input
        type="number"
        className="number-input w-16 text-center bg-[transparent] border-none outline-none px-1"
        value={formik.values.quantity}
        name="quantity"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        max={availableNodes}
      />
      <button
        type="button"
        className="p-3 hover:bg-dark-gray rounded-r-lg transition-colors"
        onClick={() => formik.setFieldValue("quantity", Math.min(formik.values.quantity + 1, tiers[currentTier.id - 1].allocation - currentTier.sold))}
      >
        <Plus className="text-text-dark-gray" size={20} />
      </button>
    </div>
  );
};

const BuyNode = ({ formik }: BuyNodeProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-10 bg-white rounded-[1.25rem] px-5 py-7">
      <div className="flex flex-col gap-7">
        <div className="flex justify-between items-center">
          <div className="text-text-heading-gray">
            Network
          </div>
          <div className="flex items-center gap-2">
            <Image src={fuseToken} alt="fuseToken" width={24} height={24} />
            <span className="text-[1.25rem] font-semibold">Fuse</span>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="text-text-heading-gray">
            Pay with
          </div>
          <div className="flex flex-col gap-5">
            {Object.keys(availableCoins).map((token) => (
              <Select key={token} formik={formik} token={token as AvailableCoinSymbol} />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-text-heading-gray">
            Quantity
          </div>
          <Input formik={formik} />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-text-heading-gray">
            Total
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Image src={usdc} alt="usdc" width={24} height={24} />
              <span className="text-5xl font-semibold md:text-2xl">
                {tiers[currentTier.id - 1].price * formik.values.quantity}
              </span>
              <span className="text-lg text-text-dark-gray font-medium">
                USDC
              </span>
            </div>
            <div className="flex justify-end items-center gap-1">
              <div className="text-[1.25rem] font-semibold">
                {tiers[currentTier.id - 1].price * formik.values.quantity}
              </div>
              <div className="text-lg text-text-dark-gray font-medium">
                USD
              </div>
            </div>
          </div>
        </div>
        <CheckConnectionWrapper className="py-4">
          <button
            className="transition ease-in-out px-12 py-4 bg-black border border-black text-lg leading-none text-white font-semibold rounded-full hover:bg-[transparent] hover:text-black"
            type="submit"
          >
            Buy Node
          </button>
        </CheckConnectionWrapper>
      </div>
    </form>
  );
};

const RunNode = () => {
  return (
    <article className="flex items-center gap-4 bg-black rounded-[1.25rem] px-6 py-8 md:flex-col md:items-start">
      <Image src={ember} alt="ember" width={78} height={84} />
      <span className="text-white text-[1.25rem] leading-tight font-semibold">
        Ready to secure the network and earn rewards?
      </span>
      <div className="group relative z-10">
        <Link
          href="https://docs.fuse.io/fuse-ember/about-fuse-ember-l2/using-node-ops-to-manage-your-node/How-To-Set-Up-A-Node-On-Linux"
          target="_blank"
          className="transition-all ease-in-out duration-300 flex items-center gap-2 bg-black leading-none font-medium text-white px-5 py-4 rounded-full whitespace-nowrap group-hover:bg-pastel-orange"
        >
          Run an Ember Node
          <ChevronRight size={16} />
        </Link>
        <div className="transition-all ease-in-out duration-300 absolute bg-linear-gradient-dark-orange rounded-[inherit] blur-[25px] -z-[1] inset-0"></div>
      </div>
    </article>
  );
};

const DelegateNode = () => {
  return (
    <article className="flex flex-col items-center gap-2 border border-black/10 rounded-[1.25rem] px-2 py-7">
      <p className="font-semibold">
        {"Don't want to run your own node?"}
      </p>
      <div className="flex items-center gap-1 text-sm">
        <Link
          href="https://docs.fuse.io/fuse-ember/about-fuse-ember-l2/using-node-ops-to-manage-your-node/how-to-delegate-a-license"
          target="_blank"
          className="underline underline-offset-4 font-semibold hover:opacity-60"
        >
          Delegate
        </Link>
        <span className="black/50 font-medium">
          your license instead!
        </span>
      </div>
    </article>
  );
};

const Home = () => {
  const formik = useFormik({
    initialValues: {
      token: "USDC" as AvailableCoinSymbol,
      quantity: 1,
    },
    validationSchema: Yup.object({
      token: Yup.string()
        .required('Required'),
      quantity: Yup.number()
        .min(1, 'Minimum 1')
        .max(availableNodes, `Maximum ${availableNodes}`)
        .required('Required'),
    }),
    onSubmit: values => {
      console.log(values);
    },
  });

  return (
    <main className="flex flex-col gap-10 grow w-8/9 my-16 max-w-7xl md:w-9/10">
      <Header />
      <div className="grid grid-cols-[1.3fr_1fr] gap-10 md:grid-cols-1">
        <section className="flex flex-col gap-8">
          <NodeDetail tierId={currentTier.id} />
          <div className="flex flex-col gap-4 relative">
            {Array.from({ length: 3 }).map((_, index) => (
              <NodeDetail
                key={index}
                tierId={(currentTier.id + 1) + index}
                classNames={{
                  article: cn(
                    index === 0
                      ? "bg-snow-drift border-2 border-gainsboro"
                      : "bg-transaction-bg border border-border-gray absolute",
                  ),
                  badge: "bg-harp text-mountain-mist",
                  content: "opacity-30"
                }}
                style={{
                  zIndex: 30 - index * 10,
                  top: index === 0 ? 0 : `${index * 1}rem`,
                  width: index === 0 ? '100%' : `${100 - (index * 3)}%`,
                  left: index === 0 ? 0 : `${index * 1.5}%`
                }}
              />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <BuyNode formik={formik} />
          <RunNode />
          <DelegateNode />
        </section>
      </div>
    </main>
  );
};

export default Home;
