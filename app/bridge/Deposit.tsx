/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { exchangeConfig, appConfig } from "@/lib/config";
import Dropdown from "@/components/ui/Dropdown";
import switchImg from "@/assets/switch.svg";
import fuseToken from "@/assets/tokenLogo.svg";
import metamask from "@/assets/metamask.svg";
import { selectChainSlice, setChain } from "@/store/chainSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchBalance,
  selectBalanceSlice,
  setNativeBalanceThunk,
} from "@/store/balanceSlice";
import alert from "@/assets/alert.svg";
import visit from "@/assets/visit.svg";
import sFuse from "@/assets/sFuse.svg";
import { estimateOriginalFee } from "@/store/feeSlice";
import * as amplitude from "@amplitude/analytics-browser";
import { useAccount, useConfig } from "wagmi";
import { evmDecimals, walletType } from "@/lib/helpers";
import { getBalance } from "wagmi/actions";
import AddToken from "@/components/bridge/AddToken";
import { getAccount } from "wagmi/actions";
import { formatUnits } from "viem";
import Image from 'next/image'

type DepositProps = {
  selectedChainSection: number;
  selectedChainItem: number;
  setSelectedChainSection: (section: number) => void;
  setSelectedChainItem: (item: number) => void;
  selectedTokenSection: number;
  selectedTokenItem: number;
  setSelectedTokenSection: (section: number) => void;
  setSelectedTokenItem: (item: number) => void;
  onSwitch: (
    tokenSection: number,
    tokenItem: number,
    chainSection: number,
    chainItem: number
  ) => void;
  amount: string;
  setAmount: (amount: string) => void;
  setDisplayButton: (display: boolean) => void;
  isExchange: boolean;
  setIsExchange: (isExchange: boolean) => void;
  isDisabledChain: boolean;
  setIsDisabledChain: (isDisabledChain: boolean) => void;
  pendingPromise: any;
  setPendingPromise: (pendingPromise: any) => void;
};

const Deposit = ({
  selectedChainSection,
  selectedChainItem,
  setSelectedChainSection,
  setSelectedChainItem,
  selectedTokenSection,
  selectedTokenItem,
  setSelectedTokenSection,
  setSelectedTokenItem,
  onSwitch,
  amount,
  setAmount,
  setDisplayButton,
  isExchange,
  setIsExchange,
  isDisabledChain,
  setIsDisabledChain,
  pendingPromise,
  setPendingPromise,
}: DepositProps) => {
  const { address, connector } = useAccount();
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const chainSlice = useAppSelector(selectChainSlice);
  const [nativeBalance, setNativeBalance] = React.useState("0");
  const config = useConfig();
  const { chainId } = getAccount(config) 
  const chain = config.chains.find(chain => chain.id === chainId) 

  useEffect(() => {
    async function updateBalance() {
      if (address) {
        const balance = await getBalance(config, {
          address,
          chainId: appConfig.wrappedBridge.chains[selectedChainItem].chainId,
        });
        setNativeBalance(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals));
      }
    }
    updateBalance();
  }, [address, selectedChainItem]);

  useEffect(() => {
    if (address && selectedChainSection === 0) {
      if (pendingPromise) {
        pendingPromise.abort();
      }
      if (
        appConfig.wrappedBridge.chains[selectedChainItem].tokens[
          selectedTokenItem
        ].isNative &&
        !appConfig.wrappedBridge.chains[selectedChainItem].tokens[
          selectedTokenItem
        ].isBridged
      ) {
        dispatch(setNativeBalanceThunk(nativeBalance));
      } else {
        const promise = dispatch(
          fetchBalance({
            address: address,
            contractAddress:
              appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                selectedTokenItem
              ].address,
            decimals:
              appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                selectedTokenItem
              ].decimals,
            bridge: appConfig.wrappedBridge.chains[selectedChainItem].original,
          })
        );
        setPendingPromise(promise);
      }
    }
  }, [
    selectedTokenItem,
    selectedTokenSection,
    address,
    chainSlice.chainId,
    selectedChainSection,
    nativeBalance,
  ]);
  useEffect(() => {
    if (chainSlice.chainId === 0 && selectedChainSection === 0) {
      dispatch(setChain(appConfig.wrappedBridge.chains[selectedChainItem]));
      dispatch(
        estimateOriginalFee({
          contractAddress:
            appConfig.wrappedBridge.chains[selectedChainItem].original,
          rpcUrl: appConfig.wrappedBridge.chains[selectedChainItem].rpcUrl,
          tokenId: appConfig.wrappedBridge.chains[selectedChainItem].tokenId,
        })
      );
    }
  }, [chainSlice.chainId, selectedChainSection]);
  return (
    <>
      <AddToken />
      <div className="flex bg-modal-bg rounded-md p-4 mt-3 w-full flex-col">
        <span className="font-medium mb-2 text-xs">From Network</span>
        <Dropdown
          items={[
            {
              heading: "Chains",
              items: appConfig.wrappedBridge.chains.map((chain) => {
                return {
                  item: chain.name,
                  icon: chain.icon,
                  id: chain.lzChainId,
                };
              }),
            },
            {
              items: appConfig.wrappedBridge.disabledChains.map((chain, i) => {
                return {
                  item: chain.chainName,
                  icon: chain.icon,
                  id: i,
                };
              }),
            },
            {
              heading: "Centralized Exchanges",
              items: exchangeConfig.exchanges.map((exchange, i) => {
                return {
                  item: exchange.name,
                  icon: exchange.icon,
                  id: i,
                };
              }),
            },
          ]}
          selectedSection={selectedChainSection}
          selectedItem={selectedChainItem}
          className="w-full"
          onClick={(section, item) => {
            setSelectedTokenItem(0);
            setSelectedChainSection(section);
            setSelectedChainItem(item);
            if (section === 1) {
              setIsExchange(false);
              setDisplayButton(false);
              setIsDisabledChain(true);
            } else if (section === 2) {
              setIsExchange(true);
              setDisplayButton(false);
              setIsDisabledChain(false);
            } else {
              setIsExchange(false);
              dispatch(setChain(appConfig.wrappedBridge.chains[item]));
              dispatch(
                estimateOriginalFee({
                  contractAddress:
                    appConfig.wrappedBridge.chains[item].original,
                  rpcUrl: appConfig.wrappedBridge.chains[item].rpcUrl,
                  tokenId: appConfig.wrappedBridge.chains[item].tokenId,
                })
              );
              setDisplayButton(true);
              setIsDisabledChain(false);
            }
          }}
        />
        {!(isExchange || isDisabledChain) && (
          <>
            <span className="font-medium mt-2 text-xs">Amount</span>
            <div className="flex w-full items-center mt-2">
              <div className="bg-white px-4 py-3 md:p-2 rounded-s-md border-[1px] border-border-gray w-2/3 md:w-3/5 flex">
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none text-sm md:text-xs"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
                <div
                  className="text-black font-medium px-3 py-1 bg-lightest-gray rounded-full cursor-pointer"
                  onClick={() => {
                    setAmount(balanceSlice.balance);
                  }}
                >
                  Max
                </div>
              </div>
              <Dropdown
                items={[
                  {
                    heading: "Tokens",
                    items: appConfig.wrappedBridge.chains[
                      selectedChainItem
                    ].tokens.map((coin, i) => {
                      return {
                        icon: coin.icon,
                        id: i,
                        item: coin.symbol,
                      };
                    }),
                  },
                ]}
                selectedSection={selectedTokenSection}
                selectedItem={selectedTokenItem}
                className="rounded-e-md rounded-s-none border-s-0 w-1/3 md:w-2/5"
                onClick={(section, item) => {
                  setSelectedTokenSection(section);
                  setSelectedTokenItem(item);
                }}
              />
            </div>
            <span className="mt-3 text-xs font-medium">
              Balance:{" "}
              {balanceSlice.isBalanceLoading ||
              chain?.id !==
                appConfig.wrappedBridge.chains[selectedChainItem].chainId ||
              balanceSlice.isApprovalLoading ? (
                <span className="px-10 py-1 ml-2 rounded-md animate-pulse bg-fuse-black/10"></span>
              ) : (
                balanceSlice.balance
              )}
            </span>
          </>
        )}
      </div>
      {isExchange ? (
        <>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex text-sm md:text-xs md:flex-col">
            <div className="flex p-2 w-[15%] items-start md:p-0">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium md:mt-2">
              <p>
                To move tokens from{" "}
                {exchangeConfig.exchanges[selectedChainItem].name} to Fuse you
                can use one of the following third-party bridges.
              </p>
              <p className="mt-2">
                Please note that these are independent service providers that
                Fuse is linking to for your convenience - Fuse has no
                responsibility for their operation.
              </p>
            </div>
          </div>
          {exchangeConfig.exchanges[selectedChainItem].bridges.map(
            (bridge, i) => {
              return (
                <a
                  href={bridge.website}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer"
                  key={i}
                  onClick={() => {
                    amplitude.track("External Provider", {
                      provider: bridge.name,
                      walletType: connector
                        ? walletType[connector.id]
                        : undefined,
                      walletAddress: address,
                    });
                  }}
                >
                  <div
                    className="flex mt-2 bg-modal-bg py-4 px-5 md:py-2 md:px-3 rounded-md items-center cursor-pointer"
                    key={i}
                  >
                    <Image src={bridge.icon} alt="icon" />
                    <div className="flex flex-col ml-3">
                      <p className="font-semibold text-base md:text-sm">
                        {bridge.name}
                      </p>
                      <p className="font-medium text-[#898888] text-sm md:text-xs">
                        {bridge.website}
                      </p>
                    </div>
                    <Image src={visit} alt="go" className="ml-auto" />
                  </div>
                </a>
              );
            }
          )}
        </>
      ) : isDisabledChain ? (
        <>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex text-sm md:text-xs">
            <div className="flex p-2 w-[10%] items-start">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium">
              <p>
                To move tokens from{" "}
                {
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .chainName
                }{" "}
                to Fuse please use{" "}
                {
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .appName
                }{" "}
                dApp.
              </p>
            </div>
          </div>
          <a
            href={
              appConfig.wrappedBridge.disabledChains[selectedChainItem].appURL
            }
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer"
            onClick={() => {
              amplitude.track("External Provider", {
                provider:
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .appName,
                walletType: connector ? walletType[connector.id] : undefined,
                walletAddress: address,
              });
            }}
          >
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer">
              <Image
                src={
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .appLogo
                }
                alt="icon"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-base">
                  {
                    appConfig.wrappedBridge.disabledChains[selectedChainItem]
                      .appName
                  }
                </p>
                <p className="font-medium text-[#898888] text-sm md:text-xs">
                  {
                    appConfig.wrappedBridge.disabledChains[selectedChainItem]
                      .appURL
                  }
                </p>
              </div>
              <Image src={visit} alt="go" className="ml-auto" />
            </div>
          </a>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <Image
              src={switchImg}
              alt="switch"
              className="mt-4 cursor-pointer"
              onClick={() => {
                onSwitch(
                  selectedTokenSection,
                  selectedTokenItem,
                  selectedChainSection,
                  selectedChainItem
                );
                dispatch(
                  setChain({
                    chainId: 122,
                    icon: fuseToken,
                    lzChainId: 138,
                    name: "Fuse",
                    rpcUrl: "https://rpc.fuse.io",
                    tokens: [],
                    wrapped: appConfig.wrappedBridge.fuse.wrapped,
                  })
                );
              }}
            />
          </div>
          <div className="flex bg-modal-bg rounded-md px-4 py-[10px] mt-3 w-full justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-base">
                To
                <Image
                  src={sFuse}
                  alt="sFuse"
                  className="inline-block ml-2 mr-2 h-7"
                />
                Fuse Network
              </span>
              <span className="font-medium mt-1 text-sm">
                You will receive{" "}
                {amount && !isNaN(parseFloat(amount)) ? parseFloat(amount) : 0}{" "}
                {appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                  selectedTokenItem
                ].receiveToken?.symbol ||
                  appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                    selectedTokenItem
                  ].symbol}
              </span>
            </div>
            {appConfig.wrappedBridge.fuse.tokens[selectedTokenItem].address && (
              <div
                className="flex px-[10px] py-2 bg-white rounded-lg cursor-pointer text-xs font-medium items-center"
                onClick={() => {
                  // @ts-ignore
                  window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                      type: "ERC20",
                      options: {
                        address:
                          appConfig.wrappedBridge.fuse.tokens[selectedTokenItem]
                            .address,
                        symbol:
                          appConfig.wrappedBridge.fuse.tokens[selectedTokenItem]
                            .symbol,
                        decimals:
                          appConfig.wrappedBridge.fuse.tokens[selectedTokenItem]
                            .decimals,
                        chainId: 122,
                      },
                    },
                  });
                }}
              >
                <Image src={metamask} alt="metamask" className="h-5 mr-1" />
                Add Token
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Deposit;
