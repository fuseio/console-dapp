import { useAccount } from "wagmi";

import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";
import OperatorRegistrationSection from "@/components/build/OperatorRegistrationSection";
import useOperatorRegistration from "@/lib/hooks/useOperatorRegistration";

const Home = () => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const { isConnected } = useAccount();
  const { isSigningMessage, isSignMessageError } = useOperatorRegistration();

  return (
    <main className="grow w-8/9 max-w-7xl mx-auto my-28 flex justify-center gap-4">
      <OperatorRegistrationSection
        operatorSlice={operatorSlice}
        isConnected={isConnected}
        isSigningMessage={isSigningMessage}
        isSignMessageError={isSignMessageError}
      />
    </main>
  )
};

export default Home;
