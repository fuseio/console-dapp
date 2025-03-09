import { useEffect, useMemo } from "react";
import { Address, formatUnits } from "viem";
import { fuse } from "viem/chains";
import { useBalance, useBlockNumber } from "wagmi";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { evmDecimals } from "../helpers";
import { TokenUsdBalance } from "../types";

const useTokenUsdBalance = ({
  address,
  chainId = fuse.id,
  tokenId = "fuse-network-token"
}: {
  address: Address;
  chainId?: number;
  tokenId?: string;
}): TokenUsdBalance => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const controller = useMemo(() => new AbortController(), []);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address,
    chainId,
  });

  const tokenBalance = useMemo(() => {
    const value = formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals);
    return new Intl.NumberFormat().format(Number(value)) || "0";
  }, [balance?.decimals, balance?.value]);

  const usdBalance = useMemo(() => {
    const usdValue = Number(tokenBalance) * balanceSlice.price;
    return new Intl.NumberFormat().format(usdValue) || "0.00";
  }, [balanceSlice.price, tokenBalance]);

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
    token: tokenBalance,
    usd: usdBalance
  }
}

export default useTokenUsdBalance;
