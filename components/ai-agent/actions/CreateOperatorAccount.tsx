import { useAccount } from "wagmi";

import OperatorRegistrationSection from "@/components/build/OperatorRegistrationSection";
import useOperatorRegistration from "@/lib/hooks/useOperatorRegistration";
import { selectOperatorSlice } from "@/store/operatorSlice";
import { useAppSelector } from "@/store/store";

const CreateOperatorAccount = () => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const { isConnected } = useAccount();
  const { isSigningMessage, isSignMessageError, checkoutCancel } = useOperatorRegistration();
  const classNames = {
    pricingArticle: "grid-cols-1"
  }

  return (
    <OperatorRegistrationSection
      operatorSlice={operatorSlice}
      isConnected={isConnected}
      isSigningMessage={isSigningMessage}
      isSignMessageError={isSignMessageError}
      checkoutCancel={checkoutCancel}
      classNames={classNames}
    />
  )
}

export default CreateOperatorAccount;
