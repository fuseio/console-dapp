import React, { useEffect } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import ReactGA from "react-ga4";
import { setWeb3OnboardProvider } from "@/lib/provider";
import { EIP1193Provider } from "@web3-onboard/core";

const ConnectWallet = ({ className = "" }: { className?: string }) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();

  useEffect(() => {
    setWeb3OnboardProvider(wallet?.provider as EIP1193Provider);
    connectionEvent(wallet);
  }, [wallet, connectedChain]);

  const connectionEvent = (wallet: any) => {
    if (wallet)
      ReactGA.event({
        category: "Connection",
        action: "Connecting wallet",
        label: wallet?.label,
      });
  };

  return (
    <button
      className={
        wallet
          ? "hidden"
          : "bg-fuse-black text-white px-4 py-2  rounded-full font-medium md:text-sm " +
            className
      }
      onClick={() => {
        wallet ? disconnect(wallet) : connect();
      }}
    >
      {wallet
        ? "Disconnect Wallet"
        : connecting
        ? "Connecting..."
        : "Connect Wallet"}
    </button>
  );
};

export default ConnectWallet;
