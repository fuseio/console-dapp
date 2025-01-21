import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { setIsNodeInstallModalOpen } from "@/store/nodesSlice";
import { useAppDispatch } from "@/store/store";
import VerifierTable from "@/components/nodes/VerifierTable";

import fuseToken from "@/assets/fuseToken.svg";

const account = {
  reward: {
    total: {
      value: 12345678,
      title: "Total Rewards"
    },
    unclaimed: {
      value: 12345678,
      title: "Unclaimed"
    },
    button: "Claim"
  },
  withdraw: {
    total: {
      value: 23456789,
      title: "Total Withdraw"
    },
    unclaimed: {
      value: 23456789,
      title: "Claimed"
    },
    button: "Withdraw"
  }
}

const Header = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
        Nodes
      </h1>
      <Link
        href=""
        onClick={() => dispatch(setIsNodeInstallModalOpen(true))}
        className="underline underline-offset-4 md:text-sm"
      >
        How to operate your own node?
      </Link>
    </header>
  );
};

const Account = () => {
  const [selectedTab, setSelectedTab] = useState<"reward" | "withdraw">("reward");

  return (
    <section className="flex flex-col gap-8 p-8 bg-white rounded-[1.25rem]">
      <div className="flex justify-between items-center border border-lightest-gray p-1 rounded-2xl">
        <button
          className="relative p-3 w-1/2"
          onClick={() => setSelectedTab("reward")}
        >
          {selectedTab === "reward" && (
            <motion.div
              layoutId="underline"
              className="absolute z-0 bg-success-light rounded-xl text-success-dark inset-0"
            />
          )}
          <span className={`relative z-10 leading-none font-semibold ${selectedTab === "reward" ? "text-success-dark" : ""}`}>
            Node Rewards
          </span>
        </button>
        <button
          className="relative p-3 w-1/2"
          onClick={() => setSelectedTab("withdraw")}
        >
          {selectedTab === "withdraw" && (
            <motion.div
              layoutId="underline"
              className="absolute z-0 bg-success-light rounded-xl text-success-dark inset-0"
            />
          )}
          <span className={`relative z-10 leading-none font-semibold ${selectedTab === "withdraw" ? "text-success-dark" : ""}`}>
            Withdraw
          </span>
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1fr_0.3fr] items-center gap-x-4 gap-y-8 md:grid-cols-1">
        <div className="flex flex-col gap-5 md:gap-2">
          <div className="flex items-center gap-2">
            <Image src={fuseToken} alt="fuseToken" width={45} height={45} />
            <div className="text-5xl font-bold leading-none md:text-4xl">
              {new Intl.NumberFormat().format(account[selectedTab].total.value)}
            </div>
            <div className="text-2xl font-bold leading-none md:text-lg">
              FUSE
            </div>
          </div>
          <div className="text-sm">
            {account[selectedTab].total.title}
          </div>
        </div>
        <div className="flex flex-col gap-5 md:gap-2">
          <div className="flex items-center gap-2">
            <Image src={fuseToken} alt="fuseToken" width={45} height={45} />
            <div className="text-5xl font-bold leading-none md:text-4xl">
              {new Intl.NumberFormat().format(account[selectedTab].unclaimed.value)}
            </div>
            <div className="text-2xl font-bold leading-none md:text-lg">
              FUSE
            </div>
          </div>
          <div className="text-sm">
            {account[selectedTab].unclaimed.title}
          </div>
        </div>
        <button className="transition-all ease-in-out border border-success bg-success rounded-full font-semibold leading-none p-3 hover:bg-[transparent] hover:border-black">
          {account[selectedTab].button}
        </button>
      </div>
    </section>
  );
};

const Info = () => {
  return (
    <section className="grid grid-cols-[1fr_1fr_1fr_0.3fr_1fr] items-center gap-8 p-8 bg-white rounded-[1.25rem] md:grid-cols-1">
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          0x892E...f8a6
        </div>
        <div className="text-sm">
          License Key Holder
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          0 (0 delegated)
        </div>
        <div className="text-sm">
          License Keys
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          0
        </div>
        <div className="text-sm">
          Average APY for delegation
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 md:items-start md:gap-2">
        <div className="bg-success rounded-full p-2 leading-none font-semibold">
          Active
        </div>
        <div className="text-sm">
          Status
        </div>
      </div>
      <button className="transition-all ease-in-out border border-success bg-success rounded-full font-semibold leading-none p-3 hover:bg-[transparent] hover:border-black">
        Delegate my License
      </button>
    </section>
  );
};

const Home = () => {
  return (
    <main className="flex flex-col gap-10 grow w-8/9 my-20 max-w-7xl md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Header />
      <Account />
      <Info />
      <VerifierTable />
    </main>
  );
};

export default Home;
