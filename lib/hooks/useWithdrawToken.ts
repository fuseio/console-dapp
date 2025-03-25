import { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { Address, formatEther, formatUnits } from "viem";

import usdc from "@/assets/usdc.svg";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import { getERC20Balance } from "../erc20";
import { useBalance } from "wagmi";
import { fuse } from "viem/chains";

type Coin = {
  name: string;
  decimals: number;
  icon: StaticImageData;
  coinGeckoId: string;
  address?: Address;
  isNative?: boolean;
}

type Coins = {
  [k: string]: Coin
}

export const coins: Coins = {
  "USDC": {
    name: "USD Coin",
    decimals: 6,
    icon: usdc,
    coinGeckoId: "usd-coin",
    address: "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A",
  },
  "USDT": {
    name: "Tether USD",
    decimals: 6,
    icon: usdt,
    coinGeckoId: "tether",
    address: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
  },
  "WETH": {
    name: "Wrapped Ether",
    decimals: 18,
    icon: weth,
    coinGeckoId: "weth",
    address: "0x5622F6dC93e08a8b717B149677930C38d5d50682",
  },
  "FUSE": {
    name: "Fuse",
    decimals: 18,
    icon: sFuse,
    coinGeckoId: "fuse-network-token",
    isNative: true,
  },
  "WFUSE": {
    name: "Wrapped Fuse",
    decimals: 18,
    icon: sFuse,
    coinGeckoId: "fuse-network-token",
    address: "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629",
  },
}

const useWithdrawToken = ({ address }: { address?: Address }) => {
  const { data: balance } = useBalance({
    address,
    chainId: fuse.id,
  });
  const [isBalance, setIsBalance] = useState(false);

  useEffect(() => {
    let isBal = false;
    Object.values(coins).forEach(async (coin) => {
      if (!address || !coin.address || isBal) return;
      const value = formatUnits(await getERC20Balance(coin.address, address), coin.decimals);
      const minBalance = 0.01;
      isBal = parseFloat(value) > minBalance;
    });
    setIsBalance(isBal);
  }, [address]);

  useEffect(() => {
    setIsBalance(parseFloat(formatEther(balance?.value ?? BigInt(0))) > 0);
  }, [balance]);

  return { isBalance };
};

export default useWithdrawToken;
