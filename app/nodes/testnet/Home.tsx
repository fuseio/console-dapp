import Link from "next/link";
import Image from "next/image";

import { setIsNodeInstallModalOpen } from "@/store/nodesSlice";
import { useAppDispatch } from "@/store/store";
import VerifierTable from "@/components/nodes/VerifierTable";

import fuseToken from "@/assets/fuseToken.svg";

const account = {
  value: 12345678,
  title: "Total Testntet Points"
}

const Header = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
        Testnet Nodes
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
  return (
    <section className="flex flex-col gap-8 p-8 bg-white rounded-[1.25rem]">
      <div className="flex justify-between items-center border border-lightest-gray p-1 rounded-2xl">
        <div
          className="flex justify-center items-center p-3 w-full bg-success-light rounded-xl"
        >
          <span className="relative z-10 leading-none font-semibold text-success-dark">
            Testnet Node Points Reward
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 md:gap-2">
          <div className="flex items-center gap-2">
            <Image src={fuseToken} alt="fuseToken" width={45} height={45} />
            <div className="text-5xl font-bold leading-none md:text-4xl">
              {new Intl.NumberFormat().format(account.value)}
            </div>
          </div>
          <div className="text-sm">
            {account.title}
          </div>
        </div>
      </div>
    </section>
  );
};

const Info = () => {
  return (
    <section className="grid grid-cols-4 items-center gap-8 p-8 bg-white rounded-[1.25rem] md:grid-cols-1">
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
      <div className="flex justify-start">
        <div className="flex flex-col items-center gap-4 md:gap-2">
          <div className="bg-success rounded-full p-2 leading-none font-semibold">
            Active
          </div>
          <div className="text-sm">
            Status
          </div>
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
