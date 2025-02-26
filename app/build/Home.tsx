import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount, useSignMessage, useSwitchChain } from "wagmi";
import { fuse } from "viem/chains";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { OperatorStateType, selectOperatorSlice, setIsOperatorWalletModalOpen, validateOperator } from "@/store/operatorSlice";
import { Wallet } from "@/components/WalletModal";
import ContactDetails from "@/components/build/ContactDetails";
import { signDataMessage } from "@/lib/helpers";
import AccountCreation from "@/components/build/AccountCreation";
import OperatorPricing from "@/components/build/OperatorPricing";
import EoaValidation from "@/components/build/EoaValidation";
import ValidateEoa from "@/components/build/ValidateEoa";
import OperatorRegistrationError from "@/components/build/OperatorRegistrationError";

type SectionProps = {
  operatorSlice: OperatorStateType;
  isConnected: boolean;
  isSigningMessage: boolean;
  isSignMessageError: boolean;
  checkoutCancel: string | null
}

const Section = ({
  operatorSlice,
  isConnected,
  isSigningMessage,
  isSignMessageError,
  checkoutCancel
}: SectionProps) => {
  if (operatorSlice.isAuthenticated || checkoutCancel) {
    return (
      <OperatorPricing />
    );
  }

  if (operatorSlice.isCreatingOperator) {
    return (
      <AccountCreation />
    );
  }

  if (operatorSlice.isLoginError) {
    return (
      <ContactDetails />
    );
  }

  if (isSignMessageError) {
    return (
      <ValidateEoa />
    );
  }

  if (isSigningMessage || operatorSlice.isValidatingOperator || operatorSlice.isFetchingOperator) {
    return (
      <EoaValidation />
    );
  }

  if (!isConnected) {
    return (
      <Wallet className="flex flex-col items-center bg-white rounded-[20px] min-h-[600px] md:min-h-[400px] w-[548px] max-w-[95%] pt-[47.5px] px-[62px] pb-[60px] md:px-5 md:py-8" />
    );
  }

  return <OperatorRegistrationError />;
}

const Home = () => {
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

  return (
    <main className="grow w-8/9 max-w-7xl mx-auto my-28 flex justify-center gap-4">
      <Section
        operatorSlice={operatorSlice}
        isConnected={isConnected}
        isSigningMessage={isSigningMessage}
        isSignMessageError={isSignMessageError}
        checkoutCancel={checkoutCancel}
      />
    </main>
  )
};

export default Home;
