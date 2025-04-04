import { Wallet } from "@/components/WalletModal";
import ContactDetails from "@/components/build/ContactDetails";
import AccountCreation from "@/components/build/AccountCreation";
import EoaValidation from "@/components/build/EoaValidation";
import ValidateEoa from "@/components/build/ValidateEoa";
import OperatorRegistrationError from "@/components/build/OperatorRegistrationError";
import { OperatorStateType } from "@/store/operatorSlice";
import RedirectingToDashboard from "@/components/build/RedirectingToDashboard";

type OperatorRegistrationSectionProps = {
  operatorSlice: OperatorStateType;
  isConnected: boolean;
  isSigningMessage: boolean;
  isSignMessageError: boolean;
}

const OperatorRegistrationSection = ({
  operatorSlice,
  isConnected,
  isSigningMessage,
  isSignMessageError,
}: OperatorRegistrationSectionProps) => {
  if (operatorSlice.isAuthenticated) {
    return (
      <RedirectingToDashboard />
    )
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

export default OperatorRegistrationSection;
