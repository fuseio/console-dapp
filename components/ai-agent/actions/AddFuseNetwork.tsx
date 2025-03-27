import { useEffect } from "react";
import { fuse } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

const AddFuseNetwork = () => {
  const { switchChain } = useSwitchChain()
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      switchChain({ chainId: fuse.id });
    }
  }, [switchChain, isConnected])

  return (<></>);
};

export default AddFuseNetwork;
