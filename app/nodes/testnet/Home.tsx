import {useEffect, useRef} from "react";
import {useAccount, useChainId} from "wagmi";
import {fuse} from "viem/chains";
import fuseIcon from "@/assets/fuse-icon.svg";
import Image from "next/image";
import {
  fetchNodeLicenseBalances,
  fetchNewNodeLicenseBalances,
  selectNodesSlice,
  setDelegateLicenseModal,
  setIsNoLicenseModalOpen,
  setIsChainModalOpen,
  fetchTestnetPoints,
  setRedelegationModal,
  fetchDelegationsFromContract,
  allowRedelegationModalReopening,
  fetchNewDelegationsFromContract,
} from "@/store/nodesSlice";
import {useAppDispatch, useAppSelector} from "@/store/store";
import VerifierTable from "@/components/nodes/VerifierTable";
import {setIsWalletModalOpen} from "@/store/navbarSlice";
import {
  eclipseAddress,
  getUserNodes,
  needsRedelegation,
  hex,
} from "@/lib/helpers";
import {Status} from "@/lib/types";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
        Testnet Nodes
      </h1>
    </header>
  );
};

export const TestnetPoints = () => {
  const dispatch = useAppDispatch();
  const {address} = useAccount();
  const {testnetPoints, testnetPointsLoading} = useAppSelector(
    (state) => state.nodes
  );

  useEffect(() => {
    if (address) {
      dispatch(fetchTestnetPoints(address));
    }
  }, [address, dispatch]);

  return (
    <section className="grid grid-cols-1 items-center gap-8 p-8 bg-white rounded-[1.25rem] mb-6">
      <div className="w-full rounded-lg p-4">
        <div className="w-full max-w-[75rem] h-[3.25rem] rounded-[1rem] p-[0.25rem] border border-[#D9D9D9]">
          <div className="h-full rounded-[0.75rem] bg-[#E0FFDD]">
            <div className="flex items-center justify-center h-full font-semibold text-[1rem] text-[#0A7500]">
              Testnet Node Points Reward
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mr-16 mt-4">
          <div className="w-[300px] mx-auto grid grid-cols-5">
            <div className="flex justify-end pr-2 col-span-2 sm:col-span-1">
              <Image src={fuseIcon} alt="Fuse" width={45} height={45} />
            </div>
            <div className="flex items-center col-span-3 sm:col-span-4">
              <span className="text-3xl font-bold sm:break-all">
                {testnetPointsLoading
                  ? "Loading..."
                  : testnetPoints
                  ? testnetPoints.toLocaleString()
                  : "0"}
              </span>
            </div>
          </div>
          <div className="text-center mt-2">Total Testnet Points</div>
        </div>
      </div>
    </section>
  );
};

const Info = () => {
  const dispatch = useAppDispatch();
  const {address} = useAccount();
  const chainId = useChainId();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const userNodes = getUserNodes(nodesSlice.user);

  const isOnFuseChain = chainId === fuse.id;

  useEffect(() => {
    if (address) {
      dispatch(
        fetchNodeLicenseBalances({
          accounts: Array.from({length: 10}, () => address),
          tokenIds: Array.from({length: 10}, (_, i) => i),
        })
      );
    }
  }, [address, dispatch]);

  return (
    <section className="grid grid-cols-4 items-center gap-8 p-8 bg-white rounded-[1.25rem] md:grid-cols-1">
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          {address ? eclipseAddress(address) : hex}
        </div>
        <div className="text-sm">License Key Holder</div>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="text-[1.25rem] font-bold">
          {userNodes.balance} ({userNodes.delegated} delegated)
        </div>
        <div className="text-sm">License Keys</div>
      </div>
      <div className="flex justify-start">
        <div className="flex flex-col items-center gap-4 md:gap-2">
          <div
            className={`rounded-full p-2 leading-none font-semibold ${
              userNodes.delegated ? "bg-success" : "bg-light-gray"
            }`}
          >
            {userNodes.delegated ? "Active" : "Inactive"}
          </div>
          <div className="text-sm">Status</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!address) {
              return dispatch(setIsWalletModalOpen(true));
            }
            if (!userNodes.canDelegate) {
              return dispatch(setIsNoLicenseModalOpen(true));
            }
            if (!isOnFuseChain) {
              return dispatch(setIsChainModalOpen(true));
            }

            dispatch(setDelegateLicenseModal({open: true, address: undefined}));
          }}
          className="transition-all ease-in-out border border-success bg-success rounded-full font-semibold leading-none p-3 hover:bg-[transparent] hover:border-black"
        >
          Delegate my License
        </button>
      </div>
    </section>
  );
};

const Home = () => {
  const dispatch = useAppDispatch();
  const {address} = useAccount();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!address) return;

    dispatch(
      fetchNodeLicenseBalances({
        accounts: Array.from({length: 10}, () => address),
        tokenIds: Array.from({length: 10}, (_, i) => i),
      })
    );

    dispatch(
      fetchNewNodeLicenseBalances({
        accounts: Array.from({length: 10}, () => address),
        tokenIds: Array.from({length: 10}, (_, i) => i),
      })
    );

    dispatch(
      fetchDelegationsFromContract({
        address: address,
        useNewContract: false,
      })
    );

    dispatch(fetchNewDelegationsFromContract(address));
  }, [address, dispatch]);

  useEffect(() => {
    const {
      fetchNodeLicenseBalancesStatus,
      fetchNewNodeLicenseBalancesStatus,
      fetchDelegationsFromContractStatus,
      fetchNewDelegationsFromContractStatus,
      user,
      redelegationModal,
      preventRedelegationModalReopening,
    } = nodesSlice;

    const isDataLoaded =
      fetchNodeLicenseBalancesStatus === Status.SUCCESS &&
      fetchNewNodeLicenseBalancesStatus === Status.SUCCESS &&
      fetchDelegationsFromContractStatus === Status.SUCCESS &&
      fetchNewDelegationsFromContractStatus === Status.SUCCESS;

    if (address && isDataLoaded) {
      const requiresRedelegation = needsRedelegation(user);

      if (
        requiresRedelegation &&
        !redelegationModal.open &&
        !preventRedelegationModalReopening
      ) {
        dispatch(setRedelegationModal({open: true}));
      } else if (!requiresRedelegation && modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    }
  }, [
    address,
    nodesSlice.fetchNodeLicenseBalancesStatus,
    nodesSlice.fetchNewNodeLicenseBalancesStatus,
    nodesSlice.fetchDelegationsFromContractStatus,
    nodesSlice.fetchNewDelegationsFromContractStatus,
    nodesSlice.user,
    nodesSlice.redelegationModal.open,
    nodesSlice.preventRedelegationModalReopening,
    dispatch,
  ]);

  useEffect(() => {
    const {redelegationModal, preventRedelegationModalReopening} = nodesSlice;

    if (preventRedelegationModalReopening && !redelegationModal.open) {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
      }

      modalTimerRef.current = setTimeout(() => {
        if (needsRedelegation(nodesSlice.user)) {
          dispatch(allowRedelegationModalReopening());
        } else {
        }
        modalTimerRef.current = null;
      }, 10000);
    }

    return () => {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    };
  }, [
    nodesSlice.redelegationModal.open,
    nodesSlice.preventRedelegationModalReopening,
    nodesSlice.user,
    dispatch,
  ]);

  return (
    <main className="flex flex-col gap-10 grow w-8/9 my-20 max-w-7xl md:w-full md:my-12 md:px-4 md:overflow-hidden">
      <Header />
      <TestnetPoints />
      <Info />
      <VerifierTable />
    </main>
  );
};

export default Home;
