import { useAccount } from "wagmi";

import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";
import OperatorRegistrationSection from "@/components/build/OperatorRegistrationSection";
import useOperatorRegistration from "@/lib/hooks/useOperatorRegistration";
import NavMenu from "@/components/NavMenu";
import { buildVisitorSubMenuItems } from "@/lib/helpers";

const Home = () => {
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const { isConnected } = useAccount();
  const { isSigningMessage, isSignMessageError } = useOperatorRegistration();

  return (
    <main className="grow w-8/9 max-w-7xl mx-auto mt-[30.84px] mb-[104.95px] md:mt-12 flex flex-col gap-10">
      <div>
        <NavMenu menuItems={buildVisitorSubMenuItems} isOpen={true} selected="register" className="md:flex" isResponsive />
      </div>
      <div className="flex justify-center mt-4">
        <OperatorRegistrationSection
          operatorSlice={operatorSlice}
          isConnected={isConnected}
          isSigningMessage={isSigningMessage}
          isSignMessageError={isSignMessageError}
        />
      </div>
    </main>
  )
};

export default Home;
