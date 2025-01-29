/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { exchangeConfig, appConfig } from "@/lib/config";
import Dropdown from "@/components/ui/Dropdown";
import switchImg from "@/assets/switch.svg";
import fuseToken from "@/assets/tokenLogo.svg";
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
import * as amplitude from "@amplitude/analytics-browser";
import { useAccount, useConfig } from "wagmi";
import { evmDecimals, walletType } from "@/lib/helpers";
import { getBalance } from "wagmi/actions";
import AddToken from "@/components/bridge/AddToken";
import { getAccount } from "wagmi/actions";
import { Address, formatUnits } from "viem";
import Image from "next/image";
import {
  fetchChargeBridgeTokens,
  selectChargeSlice,
} from "@/store/chargeSlice";

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
  isThirdPartyChain: boolean;
  setIsThirdPartyChain: (isThirdPartyChain: boolean) => void;
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
  isThirdPartyChain,
  setIsThirdPartyChain,
  pendingPromise,
  setPendingPromise,
}: DepositProps) => {
  const { address, connector } = useAccount();
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const chainSlice = useAppSelector(selectChainSlice);
  const chargeSlice = useAppSelector(selectChargeSlice);
  const [nativeBalance, setNativeBalance] = React.useState("0");
  const config = useConfig();
  const { chainId } = getAccount(config);
  const chain = config.chains.find((chain) => chain.id === chainId);

  const handleDropdownSelectedItem = (section: number, item: number) => {
    setSelectedTokenItem(0);
    setSelectedChainSection(section);
    setSelectedChainItem(item);
  };

  const handleDropdownSection = (item: number) => {
    setIsExchange(false);
    dispatch(setChain(appConfig.wrappedBridge.chains[item]));
    dispatch(
      fetchChargeBridgeTokens(appConfig.wrappedBridge.chains[item].chainId)
    );
    setDisplayButton(true);
    setIsDisabledChain(false);
    setIsThirdPartyChain(false);
  };

  useEffect(() => {
    async function updateBalance() {
      if (address) {
        const balance = await getBalance(config, {
          address,
          chainId: appConfig.wrappedBridge.chains[selectedChainItem].chainId,
        });
        setNativeBalance(
          formatUnits(
            balance?.value ?? BigInt(0),
            balance?.decimals ?? evmDecimals
          )
        );
      }
    }
    updateBalance();
  }, [address, selectedChainItem, chainId]);

  useEffect(() => {
    if (chargeSlice.isLoading) {
      return;
    }
    if (address && selectedChainSection === 0) {
      if (pendingPromise) {
        pendingPromise.abort();
      }
      if (chargeSlice.tokens[selectedTokenItem].isNative) {
        dispatch(setNativeBalanceThunk(nativeBalance));
      } else {
        const promise = dispatch(
          fetchBalance({
            address: address,
            contractAddress: chargeSlice.tokens[selectedTokenItem]
              .address as Address,
            decimals: chargeSlice.tokens[selectedTokenItem].decimals,
            // bridge: appConfig.wrappedBridge.chains[selectedChainItem].original,
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
    chainId
  ]);
  
  useEffect(() => {
    if (chainSlice.chainId === 0 && selectedChainSection === 0) {
      dispatch(setChain(appConfig.wrappedBridge.chains[selectedChainItem]));
    }
    dispatch(
      fetchChargeBridgeTokens(
        appConfig.wrappedBridge.chains[selectedChainItem].chainId
      )
    );
  }, [chainSlice.chainId, selectedChainSection]);

  useEffect(() => {
    const section = 0;
    let item = -1;

    appConfig.wrappedBridge.chains.map((wrappedBridgeChain, index) => {
      if (wrappedBridgeChain.chainId !== chain?.id) {
        return;
      }
      item = index;
    });

    if (item === -1) {
      return;
    }

    handleDropdownSelectedItem(section, item);
    handleDropdownSection(item);
  }, [chain]);

  return (
    <>
      <AddToken />
      <div className="flex bg-modal-bg rounded-[20px] p-6 mt-[30px] w-full flex-col">
        <div className="flex items-start">
          <span className="font-semibold pe-[10px] text-sm">From</span>
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
                items: appConfig.wrappedBridge.disabledChains.map(
                  (chain, i) => {
                    return {
                      item: chain.chainName,
                      icon: chain.icon,
                      id: i,
                    };
                  }
                ),
              },
              {
                items: appConfig.wrappedBridge.thirdPartyChains.map(
                  (chain, i) => {
                    return {
                      item: chain.chainName,
                      icon: chain.icon,
                      id: i,
                    };
                  }
                ),
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
            isHighlight={true}
            onClick={(section, item) => {
              handleDropdownSelectedItem(section, item);
              if (section === 1) {
                setIsExchange(false);
                setDisplayButton(false);
                setIsDisabledChain(true);
                setIsThirdPartyChain(false);
              } else if (section === 2) {
                setIsExchange(false);
                setDisplayButton(false);
                setIsDisabledChain(false);
                setIsThirdPartyChain(true);
              } else if (section === 3) {
                setIsExchange(true);
                setDisplayButton(false);
                setIsDisabledChain(false);
                setIsThirdPartyChain(false);
              } else {
                handleDropdownSection(item);
              }
            }}
            size="sm"
          />
        </div>
        {!(isExchange || isDisabledChain || isThirdPartyChain) && (
          <>
            <div className="flex w-full items-center mt-2">
              <div className="py-3 pe-4 md:p-2 rounded-s-md w-[70%] flex items-center">
                <input
                  type="text"
                  className="w-full bg-modal-bg focus:outline-none text-[34px] font-semibold"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
                <span
                  className="text-black px-3 py-1 bg-lightest-gray rounded-full cursor-pointer text-base"
                  onClick={() => {
                    setAmount(balanceSlice.balance);
                  }}
                >
                  Max
                </span>
              </div>
              <Dropdown
                items={[
                  {
                    heading: "Tokens",
                    items: chargeSlice.tokens.map((coin, i) => {
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
                className="w-[30%]"
                onClick={(section, item) => {
                  setSelectedTokenSection(section);
                  setSelectedTokenItem(item);
                }}
                isLoading={chargeSlice.isLoading}
              />
            </div>
            <span className="text-sm font-medium">
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
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex text-sm md:text-xs md:flex-col">
            <div className="flex p-2 w-[15%] items-start md:p-0">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium md:mt-2">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
        </>
      ) : isDisabledChain ? (
        <>
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
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex text-sm md:text-xs">
            <div className="flex p-2 w-[10%] items-start">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
        </>
      ) : isThirdPartyChain ? (
        <>
          <a
            href={
              appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                .appDepositURL
            }
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer"
            onClick={() => {
              amplitude.track("External Provider", {
                provider:
                  appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                    .appName,
                walletType: connector ? walletType[connector.id] : undefined,
                walletAddress: address,
              });
            }}
          >
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer">
              <Image
                src={
                  appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                    .appLogo
                }
                alt="icon"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-base">
                  {
                    appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                      .appName
                  }
                </p>
                <p className="font-medium text-[#898888] text-sm md:text-xs">
                  {
                    appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                      .domain
                  }
                </p>
              </div>
              <Image src={visit} alt="go" className="ml-auto" />
            </div>
          </a>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex text-sm md:text-xs">
            <div className="flex p-2 w-[15%] items-start">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
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
          <div className="flex bg-modal-bg rounded-[20px] p-6 mt-3 w-full justify-between items-center">
            <div className="flex flex-col w-full">
              <span className="font-semibold text-sm">
                To
                <Image
                  src={sFuse}
                  alt="sFuse"
                  className="inline-block ml-2 mr-2 h-7 -mt-1"
                  width={17}
                  height={17}
                />
                FUSE
              </span>
              <div className="flex w-full items-center mt-2">
                <div className=" pe-4 md:p-2 rounded-s-md w-[70%] flex items-center">
                  <div className="w-full bg-modal-bg focus:outline-none text-[34px] font-semibold">
                    <input
                      type="text"
                      className="w-full bg-modal-bg focus:outline-none text-[34px] font-semibold"
                      placeholder="0.00"
                      value={
                        amount && !isNaN(parseFloat(amount))
                          ? parseFloat(amount)
                          : "0.0"
                      }
                      readOnly
                    />
                  </div>
                </div>
                <Dropdown
                  items={
                    chargeSlice.isLoading
                      ? []
                      : [
                          {
                            heading: "Receive Tokens",
                            items: chargeSlice.tokens[
                              selectedTokenItem
                            ].recieveTokens.map((coin, i) => {
                              return {
                                icon: coin.icon,
                                id: i,
                                item: coin.symbol,
                              };
                            }),
                          },
                        ]
                  }
                  selectedSection={0}
                  selectedItem={0}
                  className="w-[30%]"
                  isLoading={chargeSlice.isLoading}
                />
              </div>
              {/* <span className="font-medium mt-1 text-sm">
                You will receive{" "}
                {amount && !isNaN(parseFloat(amount)) ? parseFloat(amount) : 0}{" "}
                {appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                  selectedTokenItem
                ].receiveToken?.symbol ||
                  appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                    selectedTokenItem
                  ].symbol}
              </span> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Deposit;
