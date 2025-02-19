import { createClient, defineChain } from "viem";
import { http, createConfig, Connection } from "wagmi";
import { arbitrum, polygon, fuse, optimism, mainnet, bsc, Chain, base } from "wagmi/chains";

export const flash = defineChain({
  id: 1264453517,
  name: 'Flash',
  nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.flash.fuse.io'] },
  },
  blockExplorers: {
    default: { name: 'Flash Explorer', url: 'https://explorer.flash.fuse.io' },
  },
})

const chains: readonly [Chain, ...Chain[]] = [
  fuse,
  polygon,
  optimism,
  arbitrum,
  mainnet,
  bsc,
  base,
  flash,
]

export const evmNetworks = chains.map(chain => ({
  blockExplorerUrls: [chain.blockExplorers?.default?.apiUrl],
  chainId: chain.id,
  chainName: chain.name,
  iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
  name: chain.name,
  nativeCurrency: {
    decimals: chain.nativeCurrency.decimals,
    name: chain.nativeCurrency.name,
    symbol: chain.nativeCurrency.symbol,
  },
  networkId: chain.id,
  rpcUrls: [...chain.rpcUrls.default.http],
  vanityName: chain.name,
})).map(network => ({
  ...network,
  blockExplorerUrls: network.blockExplorerUrls.filter((url): url is string => !!url)
}));

export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    });
  },
});

export const resetConnection = () => {
  config.setState((x) => ({
    ...x,
    connections: new Map<string, Connection>(),
    current: "",
  }))
}

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
