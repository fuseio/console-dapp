import { createClient } from "viem";
import { http, createConfig, Connection } from "wagmi";
import { arbitrum, polygon, fuse, optimism, mainnet, bsc, Chain, base } from "wagmi/chains";

const chains: readonly [Chain, ...Chain[]] = [
  fuse,
  polygon,
  optimism,
  arbitrum,
  mainnet,
  bsc,
  base,
]

export const evmNetworks = chains.map(chain => {
  console.log('Icon url: ', 'https://app.dynamic.xyz/assets/networks/' + chain.name + '.svg');

  return {
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
  }
}).map(network => ({
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
