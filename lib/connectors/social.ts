import { ChainNotConfiguredError, createConnector, normalizeChainId } from "@wagmi/core";
import type { IWeb3Auth } from "@web3auth/base";
import * as pkg from "@web3auth/base";
import type { IWeb3AuthModal } from "@web3auth/modal";
import { Chain, getAddress, SwitchChainError, UserRejectedRequestError } from "viem";

import type { Provider, Web3AuthConnectorParams } from "@web3auth/web3auth-wagmi-connector";

const { ADAPTER_STATUS, CHAIN_NAMESPACES, WALLET_ADAPTERS, log } = pkg;

function isIWeb3AuthModal(obj: IWeb3Auth | IWeb3AuthModal): obj is IWeb3AuthModal {
  return typeof (obj as IWeb3AuthModal).initModal !== "undefined";
}

export function Web3AuthSocialConnector(parameters: Web3AuthConnectorParams, id: string) {
  let walletProvider: Provider | null = null;

  const { web3AuthInstance, loginParams, modalConfig } = parameters;

  return createConnector<Provider>((config) => ({
    id,
    name: "Web3Auth",
    type: "Web3Auth",
    async connect({ chainId } = {}) {
      try {
        config.emitter.emit("message", {
          type: "connecting",
        });
        const provider = await this.getProvider();

        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect.bind(this));

        if (!web3AuthInstance.connected) {
          if (isIWeb3AuthModal(web3AuthInstance)) {
            await web3AuthInstance.connect();
          } else if (loginParams) {
            await web3AuthInstance.connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams);
          } else {
            log.error("please provide valid loginParams when using @web3auth/no-modal");
            throw new UserRejectedRequestError("please provide valid loginParams when using @web3auth/no-modal" as unknown as Error);
          }
        }

        let currentChainId: any = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain!({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code) throw error;
            return { id: currentChainId };
          });
          currentChainId = chain?.id ?? currentChainId;
        }

        const accounts = await this.getAccounts();

        return { accounts, chainId: currentChainId };
      } catch (error) {
        log.error("error while connecting", error);
        this.onDisconnect();
        throw new UserRejectedRequestError("Something went wrong" as unknown as Error);
      }
    },
    async getAccounts() {
      const provider = await this.getProvider();
      const accounts: any = await provider.request<unknown, string[]>({
        method: "eth_accounts",
      });
      if (accounts) {
        return accounts.filter((x: string | undefined): x is string => !!x).map((x: string) => getAddress(x));
      } else {
        return [];
      }
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request<unknown, number>({ method: "eth_chainId" });
      return normalizeChainId(chainId);
    },
    async getProvider(): Promise<Provider> {
      const selectedConnectorId = localStorage.getItem('Fuse-selectedConnectorId');
      if (selectedConnectorId === id) {
        if (walletProvider) {
          return walletProvider;
        }
        if (web3AuthInstance.status === ADAPTER_STATUS.NOT_READY) {
          if (isIWeb3AuthModal(web3AuthInstance)) {
            await web3AuthInstance.initModal({
              modalConfig,
            });
          } else if (loginParams) {
            await web3AuthInstance.init();
          } else {
            log.error("please provide valid loginParams when using @web3auth/no-modal");
            throw new UserRejectedRequestError("please provide valid loginParams when using @web3auth/no-modal" as unknown as Error);
          }
        }

        walletProvider = web3AuthInstance.provider;
      }
      return walletProvider!;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ chainId }): Promise<Chain> {
      try {
        const chain = config.chains.find((x) => x.id === chainId);
        if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

        await web3AuthInstance.addChain({
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: `0x${chain.id.toString(16)}`,
          rpcTarget: chain.rpcUrls.default.http[0],
          displayName: chain.name,
          blockExplorerUrl: chain.blockExplorers?.default.url || "",
          ticker: chain.nativeCurrency?.symbol || "ETH",
          tickerName: chain.nativeCurrency?.name || "Ethereum",
          decimals: chain.nativeCurrency?.decimals || 18,
          logo: chain.nativeCurrency?.symbol
            ? `https://images.toruswallet.io/${chain.nativeCurrency?.symbol.toLowerCase()}.svg`
            : "https://images.toruswallet.io/eth.svg",
        });
        log.info("Chain Added: ", chain.name);
        await web3AuthInstance.switchChain({ chainId: `0x${chain.id.toString(16)}` });
        log.info("Chain Switched to ", chain.name);
        config.emitter.emit("change", {
          chainId,
        });
        return chain;
      } catch (error: unknown) {
        log.error("Error: Cannot change chain", error);
        throw new SwitchChainError(error as Error);
      }
    },
    async disconnect(): Promise<void> {
      await web3AuthInstance.logout();
      const provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      localStorage.removeItem('Fuse-selectedConnectorId');
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) config.emitter.emit("disconnect");
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },
    onChainChanged(chain) {
      const chainId = normalizeChainId(chain);
      config.emitter.emit("change", { chainId });
    },
    onDisconnect(): void {
      config.emitter.emit("disconnect");
    },
  }));
}
