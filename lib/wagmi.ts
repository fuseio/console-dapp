import { createClient, defineChain } from "viem";
import { http, createConfig, Connection } from "wagmi";
import { arbitrum, polygon, fuse, optimism, mainnet, bsc, Chain, base } from "wagmi/chains";

export const flash = defineChain({
  id: 10920,
  name: 'Fuse Flash',
  nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://lingering-lingering-pool.fuse-flash.quiknode.pro'] },
  },
  blockExplorers: {
    default: { name: 'Flash Explorer', url: 'https://fuse-flash.explorer.quicknode.com' },
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

const transports: Record<number, ReturnType<typeof http>> = {
  [fuse.id]: http(),
  [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`),
  [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_API_KEY}`),
  [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ARBITRUM_API_KEY}`),
  [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_API_KEY}`),
  [bsc.id]: http(`https://bnb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_API_KEY}`),
  [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_BASE_API_KEY}`),
  [flash.id]: http(),
}

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
      transport: transports[chain.id],
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
