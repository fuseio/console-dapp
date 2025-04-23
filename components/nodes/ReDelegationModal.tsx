"use client";

import Image from "next/image";
import {useEffect, useState, useCallback, Fragment, memo, useRef} from "react";
import {useAccount} from "wagmi";

import {useAppDispatch, useAppSelector} from "@/store/store";
import {
  delegateNewNodeLicense,
  selectNodesSlice,
  setRedelegationModal,
  fetchNodeLicenseBalances,
  fetchNewNodeLicenseBalances,
  fetchDelegationsFromContract,
  resetDelegationStatus,
  allowRedelegationModalReopening,
  fetchNewDelegationsFromContract,
} from "@/store/nodesSlice";
import Spinner from "@/components/ui/Spinner";

import close from "@/assets/close.svg";
import {Status} from "@/lib/types";
import {eclipseAddress} from "@/lib/helpers";

type OperatorDelegation = {
  address: `0x${string}`;
  name: string;
  amount: number;
  tokenId: number;
  uniqueKey: string;
  isRedelegated: boolean;
  isPartiallyRedelegated?: boolean;
  amountRedelegated?: number;
  amountRemaining?: number;
};

const RedelegationModal = memo((): JSX.Element => {
  const dispatch = useAppDispatch();
  const {address} = useAccount();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const [operators, setOperators] = useState<OperatorDelegation[]>([]);
  const [processingOperator, setProcessingOperator] = useState<
    `0x${string}` | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (nodesSlice.redelegationModal.open) {
      setIsVisible(true);
    }
  }, [nodesSlice.redelegationModal.open]);

  const isDelegatingRef = useRef(false);

  useEffect(() => {
    if (
      isVisible &&
      nodesSlice.fetchDelegationsFromContractStatus === Status.SUCCESS &&
      nodesSlice.fetchNewDelegationsFromContractStatus === Status.SUCCESS &&
      nodesSlice.fetchNodeLicenseBalancesStatus === Status.SUCCESS &&
      nodesSlice.fetchNewNodeLicenseBalancesStatus === Status.SUCCESS
    ) {
      console.log(
        "ReDelegationModal checking if redelegation is needed with loaded data"
      );

      const allAlreadyRedelegated =
        operators.length > 0 && operators.every((op) => op.isRedelegated);

      const hasOldDelegations = nodesSlice.user.delegations.some(
        (d) => d.NFTAmount > 0
      );

      const hasOldNFTs = nodesSlice.user.licences.some((l) => l.balance > 0);

      console.log("Redelegation requirements check:", {
        "1. All already redelegated?": allAlreadyRedelegated,
        "2. Has old delegations?": hasOldDelegations,
        "3. Has old NFTs?": hasOldNFTs,
        "Valid redelegation scenario?":
          !allAlreadyRedelegated && hasOldDelegations && hasOldNFTs,
      });

      if (allAlreadyRedelegated || !hasOldDelegations || !hasOldNFTs) {
        console.log("Conditions not met, auto-closing redelegation modal");
        setTimeout(() => {
          setIsVisible(false);
          dispatch(setRedelegationModal({open: false}));
        }, 100);
      }
    }
  }, [
    isVisible,
    operators,
    dispatch,
    nodesSlice.fetchDelegationsFromContractStatus,
    nodesSlice.fetchNewDelegationsFromContractStatus,
    nodesSlice.fetchNodeLicenseBalancesStatus,
    nodesSlice.fetchNewNodeLicenseBalancesStatus,
    nodesSlice.user.delegations,
    nodesSlice.user.licences,
  ]);

  const handleCloseModal = useCallback(() => {
    if (isDelegatingRef.current) {
      console.log("Cannot close modal during delegation");
      return;
    }

    setIsVisible(false);

    if (nodesSlice.delegateLicenseStatus === Status.SUCCESS) {
      setTimeout(() => {
        dispatch(resetDelegationStatus());
      }, 100);
    }

    setTimeout(() => {
      dispatch(setRedelegationModal({open: false}));
    }, 50);
  }, [dispatch, nodesSlice.delegateLicenseStatus]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDelegatingRef.current) return;

      if (e.target === e.currentTarget) {
        e.preventDefault();
        handleCloseModal();
      }
    },
    [handleCloseModal]
  );

  useEffect(() => {
    if (isVisible && address) {
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
    }
  }, [isVisible, address, dispatch]);

  useEffect(() => {
    if (nodesSlice.user) {
      const activeDelegations = nodesSlice.user.delegations.filter(
        (delegation) => delegation.NFTAmount > 0
      );

      const newDelegations = nodesSlice.user.newDelegations || [];

      // Create a unique key for each delegation using address+tokenId
      const operators = activeDelegations.map((delegation) => {
        const address = delegation.Address as `0x${string}`;
        const tokenId = delegation.NFTTokenID;
        const amount = delegation.NFTAmount;
        const uniqueKey = `${address.toLowerCase()}-${tokenId}`; // Use the combination as a unique key

        // Only match new delegations with the SAME tokenId to the SAME address
        const matchingNewDelegations =
          newDelegations?.filter(
            (newDel) =>
              newDel.Address.toLowerCase() === address.toLowerCase() &&
              newDel.NFTTokenID === tokenId
          ) || [];

        const totalAmountRedelegated = matchingNewDelegations.reduce(
          (total, newDel) => total + newDel.NFTAmount,
          0
        );

        const isRedelegated = totalAmountRedelegated >= amount;
        const isPartiallyRedelegated =
          totalAmountRedelegated > 0 && totalAmountRedelegated < amount;
        const amountRemaining = Math.max(0, amount - totalAmountRedelegated);

        return {
          address,
          name: eclipseAddress(address),
          amount,
          tokenId,
          uniqueKey, // Add the unique key for component rendering
          isRedelegated,
          isPartiallyRedelegated,
          amountRedelegated: totalAmountRedelegated,
          amountRemaining,
        };
      });

      setOperators(operators);
      console.log("Updated operators with unique keys:", operators);
    }
  }, [nodesSlice.user?.delegations, nodesSlice.user?.newDelegations]);

  const handleRedelegate = useCallback(
    async (operator: OperatorDelegation, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setProcessingOperator(operator.address);
      isDelegatingRef.current = true;

      try {
        const matchingNewLicense = nodesSlice.user.newLicences.find(
          (license) => license.tokenId === operator.tokenId + 1
        );

        if (
          !matchingNewLicense ||
          matchingNewLicense.balance === 0 ||
          !address
        ) {
          console.error(
            "No matching new license available or insufficient balance"
          );
          throw new Error(
            "No matching new license available with sufficient balance"
          );
        }

        await dispatch(
          delegateNewNodeLicense({
            to: operator.address,
            tokenId: operator.tokenId,
            amount: operator.amount,
          })
        ).unwrap();

        if (address) {
          await Promise.all([
            dispatch(
              fetchNodeLicenseBalances({
                accounts: Array.from({length: 10}, () => address),
                tokenIds: Array.from({length: 10}, (_, i) => i),
              })
            ),
            dispatch(
              fetchNewNodeLicenseBalances({
                accounts: Array.from({length: 10}, () => address),
                tokenIds: Array.from({length: 10}, (_, i) => i),
              })
            ),
            dispatch(
              fetchDelegationsFromContract({
                address: address,
                useNewContract: false,
              })
            ),
            dispatch(fetchNewDelegationsFromContract(address)),
          ]);
        }

        // Update state using the uniqueKey instead of just the address
        setOperators((prev) =>
          prev.map((op) =>
            op.uniqueKey === operator.uniqueKey
              ? {...op, isRedelegated: true}
              : op
          )
        );
      } catch (error: any) {
        console.error("Redelegation failed:", error);
      } finally {
        setProcessingOperator(null);
        isDelegatingRef.current = false;
      }
    },
    [nodesSlice.user.newLicences, address, dispatch]
  );

  const handleCloseButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDelegatingRef.current) return;

      handleCloseModal();

      setTimeout(() => {
        dispatch(allowRedelegationModalReopening());
      }, 300000);
    },
    [handleCloseModal, dispatch]
  );

  if (!isVisible) {
    return <Fragment />;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-[520px] max-w-[95%] z-50 rounded-[20px] pt-[40px] px-[40px] pb-[40px] md:px-5 md:py-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-[28px]/[40px] font-bold">
            Redelegation required
          </h2>
          <button
            className="flex items-center justify-center hover:bg-gray-100 rounded-full p-1"
            onClick={handleCloseButtonClick}
            aria-label="Close modal"
            type="button"
            disabled={!!processingOperator}
          >
            <Image src={close} alt="close" className="cursor-pointer w-6" />
          </button>
        </div>

        <p className="mt-4 text-sm text-text-heading-gray">
          Weve reminted your node licenses. Please redelegate them to maintain
          your rewards.
        </p>

        <div className="mt-6 space-y-4">
          {operators.length > 0 ? (
            operators.map((operator) => (
              <div key={operator.uniqueKey} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{operator.name}</div>
                    <div className="text-sm text-gray-600">
                      {operator.amount} licenses of Tier {operator.tokenId + 1}
                    </div>
                  </div>
                  {operator.isRedelegated ? (
                    <span className="text-sm rounded-full px-3 py-1 bg-green-100 text-green-800">
                      Redelegated
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleRedelegate(operator, e)}
                      disabled={!!processingOperator}
                      className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-md transition-colors disabled:opacity-60 font-medium border border-black"
                    >
                      {processingOperator === operator.address ? (
                        <span className="flex items-center gap-2">
                          <Spinner /> Processing...
                        </span>
                      ) : (
                        "Redelegate"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {nodesSlice.fetchDelegationsFromContractStatus ===
                Status.PENDING ||
              nodesSlice.fetchNewDelegationsFromContractStatus ===
                Status.PENDING ? (
                <div className="flex justify-center items-center gap-2">
                  <Spinner /> Loading delegations...
                </div>
              ) : (
                "No delegations found requiring redelegation"
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleCloseButtonClick}
            className="transition-all ease-in-out border rounded-full font-semibold px-6 py-2 bg-[rgb(180,249,186)] text-black border-[rgb(180,249,186)] hover:bg-[rgb(160,229,166)] hover:border-[rgb(160,229,166)] disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500"
            type="button"
            disabled={!!processingOperator}
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  );
});

RedelegationModal.displayName = "RedelegationModal";

export default RedelegationModal;
