import { useEffect, useMemo, useState } from "react";
import { Address, formatUnits } from "viem";
import { fuse } from "viem/chains";
import { useBalance, useBlockNumber } from "wagmi";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { evmDecimals, hex } from "../helpers";
import { TokenUsdBalance } from "../types";
import { getERC20Balance, getERC20Decimals } from "../erc20";

const useTokenUsdBalance = ({
  address,
  chainId = fuse.id,
  tokenId = "fuse-network-token",
  contractAddress
}: {
  address: Address;
  chainId?: number;
  tokenId?: string;
  contractAddress?: Address;
}): TokenUsdBalance => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const controller = useMemo(() => new AbortController(), []);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address,
    chainId,
  });
  const [tokenBalance, setTokenBalance] = useState("0");

  const coinBalance = useMemo(() => {
    const value = formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals);
    return new Intl.NumberFormat().format(Number(value)) || "0";
  }, [balance?.decimals, balance?.value]);

  const usdBalance = useMemo(() => {
    const usdValue = Number(tokenBalance) * balanceSlice.price;
    return new Intl.NumberFormat().format(usdValue) || "0.00";
  }, [balanceSlice.price, tokenBalance]);

  useEffect(() => {
    (async () => {
      if (!contractAddress || !address || address === hex) {
        return;
      }
      const decimals = await getERC20Decimals(contractAddress);
      const value = formatUnits(await getERC20Balance(contractAddress, address), decimals);
      setTokenBalance(new Intl.NumberFormat().format(Number(value)) || "0");
    })()
  }, [address, contractAddress]);

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch])


  useEffect(() => {
    if (!tokenId) return;

    dispatch(fetchUsdPrice({
      tokenId,
      controller
    }))

    return () => {
      controller.abort();
    }
  }, [controller, dispatch, tokenId])

  return {
    coin: coinBalance,
    token: tokenBalance,
    usd: usdBalance
  }
}

export default useTokenUsdBalance;
