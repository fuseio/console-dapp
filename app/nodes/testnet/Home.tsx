import { useEffect } from "react";
import { useAccount } from "wagmi";

import { fetchNodeLicenseBalances, selectNodesSlice, setDelegateLicenseModal, setIsNoLicenseModalOpen } from "@/store/nodesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import VerifierTable from "@/components/nodes/VerifierTable";
import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { eclipseAddress, getUserNodes, hex } from "@/lib/helpers";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
        Testnet Nodes
      </h1>
    </header>
  );
};

const Info = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const userNodes = getUserNodes(nodesSlice.user)

  useEffect(() => {
    if (address) {
      dispatch(fetchNodeLicenseBalances({
        accounts: Array.from({ length: 10 }, () => address),
        tokenIds: Array.from({ length: 10 }, (_, i) => i),
      }));
    }
  }, [address, dispatch]);

  return (
    <section className="grid grid-cols-4 items-center gap-8 p-8 bg-white rounded-[1.25rem] md:grid-cols-1">
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          {address ? eclipseAddress(address) : hex}
        </div>
        <div className="text-sm">
          License Key Holder
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          {userNodes.balance} ({userNodes.delegated} delegated)
        </div>
        <div className="text-sm">
          License Keys
        </div>
      </div>
      <div className="flex justify-start">
        <div className="flex flex-col items-center gap-4 md:gap-2">
          <div className={`rounded-full p-2 leading-none font-semibold ${userNodes.delegated ? "bg-success" : "bg-light-gray"}`}>
            {userNodes.delegated ? "Active" : "Inactive"}
          </div>
          <div className="text-sm">
            Status
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          if (!address) {
            return dispatch(setIsWalletModalOpen(true));
          }
          if (!userNodes.canDelegate) {
            return dispatch(setIsNoLicenseModalOpen(true));
          }
          dispatch(setDelegateLicenseModal({ open: true, address: undefined }));
        }}
        className="transition-all ease-in-out border border-success bg-success rounded-full font-semibold leading-none p-3 hover:bg-[transparent] hover:border-black"
      >
        Delegate my License
      </button>
    </section>
  );
};

const Home = () => {
  return (
    <main className="flex flex-col gap-10 grow w-8/9 my-20 max-w-7xl md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Header />
      <Info />
      <VerifierTable />
    </main>
  );
};

export default Home;
