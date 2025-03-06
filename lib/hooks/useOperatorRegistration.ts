import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { fuse } from "viem/chains";
import { useAccount, useSignMessage, useSwitchChain } from "wagmi";

import { selectOperatorSlice, setIsOperatorWalletModalOpen, validateOperator } from "@/store/operatorSlice";
import { signDataMessage } from "../helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";

const useOperatorRegistration = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const searchParams = useSearchParams();
  const checkoutCancel = searchParams.get('checkout-cancel');

  const { signMessage, isPending: isSigningMessage, isError: isSignMessageError } =
    useSignMessage({
      mutation: {
        onSuccess(data) {
          if (!address) {
            return;
          }
          dispatch(
            validateOperator({
              signData: {
                externallyOwnedAccountAddress: address,
                message: signDataMessage,
                signature: data,
              },
            })
          );
        },
      },
    });

  useEffect(() => {
    if (!isConnected) {
      dispatch(setIsOperatorWalletModalOpen(true));
    }
  }, [dispatch, isConnected]);

  useEffect(() => {
    if (isConnected && chain && !operatorSlice.isValidated) {
      if (chain.id !== fuse.id) {
        switchChain({ chainId: fuse.id });
      }
      signMessage({ message: signDataMessage });
    }
  }, [isConnected, chain, operatorSlice.isValidated, signMessage, switchChain]);

  return {
    isSigningMessage,
    isSignMessageError,
    checkoutCancel
  }
}

export default useOperatorRegistration;
