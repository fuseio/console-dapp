import { encodePacked } from "viem";
import { Address } from "abitype";

/**
 * Chain metadata pulled from the LayerZero Metadata Service:
 * https://metadata.layerzero-api.com/v1/metadata/deployments
 *
 * Keyed by LayerZero EPv1 chain ID (eid).
 */
const metadata: Record<number, { name: string; nativeCurrency: string; averageBlockTime: number }> = {
  101: { name: "Ethereum", nativeCurrency: "ETH", averageBlockTime: 10800 },
  102: { name: "BNB Chain", nativeCurrency: "BNB", averageBlockTime: 1400 },
  109: { name: "Polygon", nativeCurrency: "POL", averageBlockTime: 2000 },
  110: { name: "Arbitrum", nativeCurrency: "ETH", averageBlockTime: 200 },
  111: { name: "Optimism", nativeCurrency: "ETH", averageBlockTime: 1800 },
  138: { name: "Fuse", nativeCurrency: "FUSE", averageBlockTime: 4500 },
  145: { name: "Gnosis", nativeCurrency: "DAI", averageBlockTime: 4500 },
  184: { name: "Base", nativeCurrency: "ETH", averageBlockTime: 1800 },
};

/**
 * Encodes LayerZero V1 adapter parameters.
 * Replaces AdapterParams.forV1() + serializeAdapterParams().
 */
export function encodeAdapterParamsV1(gasLimit: number): Address {
  return encodePacked(["uint16", "uint256"], [1, BigInt(gasLimit)]) as Address;
}

/**
 * Returns the network name for a LayerZero chain ID.
 * Data source: LayerZero Metadata Service (chainDetails.name).
 */
export function getNetworkName(lzChainId: number): string {
  return metadata[lzChainId]?.name ?? `Chain ${lzChainId}`;
}

/**
 * Returns the native currency symbol for a LayerZero chain ID.
 * Data source: LayerZero Metadata Service (chainDetails.nativeCurrency.symbol).
 */
export function getNativeCurrencySymbol(lzChainId: number): string {
  return metadata[lzChainId]?.nativeCurrency ?? "";
}

/**
 * Returns a LayerZero Scan link for a transaction.
 */
export function getScanLink(lzChainId: number, txHash: string): string {
  return `https://layerzeroscan.com/tx/${txHash}`;
}

/**
 * Returns estimated cross-chain transaction time in seconds.
 * Uses averageBlockTime from LayerZero Metadata Service with
 * a multiplier for typical block confirmations needed.
 */
export function getEstimatedTransactionTime(lzChainId: number): number {
  const chain = metadata[lzChainId];
  if (!chain) return 600;
  // averageBlockTime is in ms; estimate ~10 confirmations worth of time
  return Math.max(60, Math.ceil((chain.averageBlockTime * 10) / 1000));
}
