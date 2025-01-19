import Link from "next/link";

import { setIsNodeInstallModalOpen } from "@/store/nodesSlice";
import { useAppDispatch } from "@/store/store";
import VerifierTable from "@/components/nodes/VerifierTable";

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
      >
        How to operate your own node?
      </Link>
    </header>
  );
};

const Home = () => {
  return (
    <main className="grow w-8/9 my-20 max-w-7xl md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Header />
      <VerifierTable />
    </main>
  );
};

export default Home;
