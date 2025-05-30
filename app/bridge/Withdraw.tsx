/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { appConfig } from "@/lib/config";
import Dropdown from "@/components/ui/Dropdown";
import switchImg from "@/assets/switch.svg";
import metamask from "@/assets/metamask.svg";
import fuseToken from "@/assets/tokenLogo.svg";
import Image from "next/image";
import {
  selectBalanceSlice,
  fetchBalance,
  fetchLiquidity,
  setNativeBalanceThunk,
} from "@/store/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectChainSlice, setChain } from "@/store/chainSlice";
import alert from "@/assets/alert.svg";
import visit from "@/assets/visit.svg";
import sFuse from "@/assets/sFuse.svg";
import { estimateWrappedFee } from "@/store/feeSlice";
import { toggleLiquidityToast } from "@/store/toastSlice";
import * as amplitude from "@amplitude/analytics-browser";
import { useAccount, useConfig } from "wagmi";
import { getBalance } from "wagmi/actions";
import { fuse } from "viem/chains";
import { evmDecimals, hex, walletType } from "@/lib/helpers";
import { getAccount } from "wagmi/actions";
import { fetchAvailableLiquidityOnChains } from "@/store/liquiditySlice";
import { formatUnits } from "viem";
import { stargateConfig } from "@/lib/stargate";

type WithdrawProps = {
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
  isDisabledChain: boolean;
  setIsDisabledChain: (isDisabledChain: boolean) => void;
  isThirdPartyChain: boolean;
  setIsThirdPartyChain: (isThirdPartyChain: boolean) => void;
  setDisplayButton: (displayButton: boolean) => void;
  pendingPromise: any;
  setPendingPromise: (pendingPromise: any) => void;
  isStargate: boolean;
  setIsStargate: (isStargate: boolean) => void;
};

const Withdraw = ({
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
  isDisabledChain,
  setIsDisabledChain,
  isThirdPartyChain,
  setIsThirdPartyChain,
  setDisplayButton,
  pendingPromise,
  setPendingPromise,
  isStargate,
  setIsStargate,
}: WithdrawProps) => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const chainSlice = useAppSelector(selectChainSlice);
  const [nativeBalance, setNativeBalance] = React.useState<string>("0");
  const { address, connector } = useAccount();
  const config = useConfig();
  const { chainId } = getAccount(config);
  const chain = config.chains.find((chain) => chain.id === chainId);

  useEffect(() => {
    async function updateBalance() {
      if (address) {
        const balance = await getBalance(config, {
          address,
          chainId: fuse.id,
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
  }, [address]);

  useEffect(() => {
    if (
      !appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isNative ||
      !appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isBridged
    ) {
      dispatch(
        fetchLiquidity({
          bridge: appConfig.wrappedBridge.chains[selectedChainItem].original,
          contractAddress:
            appConfig.wrappedBridge.chains[selectedChainItem].tokens[
              selectedTokenItem
            ].address,
          decimals:
            appConfig.wrappedBridge.chains[selectedChainItem].tokens[
              selectedTokenItem
            ].decimals,
          rpcUrl: appConfig.wrappedBridge.chains[selectedChainItem].rpcUrl,
        })
      );
    }
  }, [selectedTokenItem, selectedChainItem]);
  useEffect(() => {
    if (
      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isStargate
    ) {
      setIsStargate(true);
      setDisplayButton(false);
    } else {
      setIsStargate(false);
      setDisplayButton(true);
    }
    if (address && selectedChainSection === 0) {
      if (pendingPromise) {
        pendingPromise.abort();
      }
      const tokenChain =
        appConfig.wrappedBridge.chains[selectedChainItem].tokens[
          selectedTokenItem
        ].coinGeckoId;
      const tokenFuse = appConfig.wrappedBridge.fuse.tokens.find(
        (token) => token.coinGeckoId === tokenChain
      );
      const promise =
        (!tokenFuse?.address || tokenFuse.address === hex) &&
        chain?.id === fuse.id
          ? dispatch(setNativeBalanceThunk(nativeBalance.toString()))
          : dispatch(
              fetchBalance({
                address: address,
                contractAddress: tokenFuse?.address as `0x${string}`,
                decimals: tokenFuse?.decimals as number,
                bridge: appConfig.wrappedBridge.fuse.wrapped,
                rpc: "https://rpc.fuse.io",
              })
            );
      setPendingPromise(promise);
    }
  }, [
    selectedTokenItem,
    selectedTokenSection,
    address,
    chainSlice.chainId,
    nativeBalance,
    chain,
  ]);
  useEffect(() => {
    if (
      !appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isNative &&
      !balanceSlice.isLiquidityLoading &&
      parseFloat(amount) > parseFloat(balanceSlice.liquidity) &&
      parseFloat(amount) <= parseFloat(balanceSlice.balance)
    ) {
      dispatch(toggleLiquidityToast(true));
      dispatch(
        fetchAvailableLiquidityOnChains({
          amount: amount,
          token:
            appConfig.wrappedBridge.chains[selectedChainItem].tokens[
              selectedTokenItem
            ].symbol,
        })
      );
      amplitude.track("Withdraw: Insufficient Liquidity", {
        amount: parseFloat(amount),
        network: appConfig.wrappedBridge.chains[selectedChainItem].name,
        token:
          appConfig.wrappedBridge.chains[selectedChainItem].tokens[
            selectedTokenItem
          ].symbol,
        available_liquidity: parseFloat(balanceSlice.liquidity),
        walletType: connector ? walletType[connector.id] : undefined,
        walletAddress: address,
      });
    } else if (
      parseFloat(amount) === 0 ||
      !amount ||
      (!appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isNative &&
        !balanceSlice.isLiquidityLoading &&
        parseFloat(amount) <= parseFloat(balanceSlice.liquidity))
    ) {
      dispatch(toggleLiquidityToast(false));
    }
  }, [balanceSlice.liquidity, amount]);
  useEffect(() => {
    if (chainSlice.chainId === 0) {
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
    }
  }, [chainSlice.chainId]);
  return (
    <>
      {!(isDisabledChain || isThirdPartyChain) && (
        <>
          <div className="flex bg-modal-bg rounded-md p-4 mt-3 w-full flex-col">
            <span className="font-medium text-xs">
              From
              <Image
                src={sFuse}
                alt="sFuse"
                className="inline-block ml-[6px] mr-[6px] h-5"
              />
              Fuse Network
            </span>
            <div className="flex w-full items-center mt-2">
              <div className="bg-white w-2/3 md:w-3/5 px-4 py-3 md:p-2 rounded-s-md border-[1px] border-border-gray flex">
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
                    const tokenChain =
                      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                        selectedTokenItem
                      ].coinGeckoId;
                    const tokenFuse = appConfig.wrappedBridge.fuse.tokens.find(
                      (token) => token.coinGeckoId === tokenChain
                    );
                    setAmount(
                      tokenFuse?.isNative && chain?.id === fuse.id
                        ? parseFloat(nativeBalance).toString()
                        : balanceSlice.balance
                    );
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
                        item: coin.receiveToken?.symbol || coin.symbol,
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
                dropdownWidth="w-[200%]"
              />
            </div>
            <span className="mt-3 text-xs font-medium">
              Balance:{" "}
              {balanceSlice.isBalanceLoading ||
              balanceSlice.isApprovalLoading ||
              chain?.id !== fuse.id ? (
                <span className="px-10 py-1 ml-2 rounded-md animate-pulse bg-fuse-black/10"></span>
              ) : (
                balanceSlice.balance
              )}
            </span>
          </div>
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
                  setChain(appConfig.wrappedBridge.chains[selectedChainItem])
                );
              }}
            />
          </div>
        </>
      )}
      {!isStargate && (
        <div className="flex bg-modal-bg rounded-md p-4 mt-3 w-full flex-col">
          <span className="font-medium mb-2 text-xs ">To Network</span>
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
            ]}
            selectedSection={selectedChainSection}
            selectedItem={selectedChainItem}
            isHighlight={true}
            onClick={(section, item) => {
              setSelectedTokenItem(0);
              setSelectedChainSection(section);
              setSelectedChainItem(item);
              if (section === 1) {
                setDisplayButton(false);
                setIsDisabledChain(true);
                setIsThirdPartyChain(false);
              } else if (section === 2) {
                setDisplayButton(false);
                setIsDisabledChain(false);
                setIsThirdPartyChain(true);
              } else {
                dispatch(
                  estimateWrappedFee({
                    contractAddress: appConfig.wrappedBridge.fuse.wrapped,
                    lzChainId: appConfig.wrappedBridge.chains[item].lzChainId,
                    rpcUrl: "https://rpc.fuse.io",
                    tokenId: "fuse-network-token",
                  })
                );
                setDisplayButton(true);
                setIsDisabledChain(false);
                setIsThirdPartyChain(false);
              }
            }}
          />
          {!(isDisabledChain || isThirdPartyChain) && (
            <span className="text-black/50 font-medium mt-3 text-sm flex items-center justify-between">
              <span>
                You will receive: <br />
                <span className="text-black font-medium">
                  {" "}
                  {amount && !isNaN(parseFloat(amount))
                    ? parseFloat(amount)
                    : 0}{" "}
                  <span className="font-bold">
                    {
                      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                        selectedTokenItem
                      ].symbol
                    }
                  </span>
                </span>
              </span>
              <div
                className="flex px-[10px] py-2 bg-white rounded-lg cursor-pointer text-xs font-medium items-center text-black"
                onClick={() => {
                  window?.ethereum?.request({
                    method: "wallet_watchAsset",
                    params: {
                      type: "ERC20",
                      options: {
                        address:
                          appConfig.wrappedBridge.chains[selectedChainItem]
                            .tokens[selectedTokenItem].address,
                        symbol:
                          appConfig.wrappedBridge.chains[selectedChainItem]
                            .tokens[selectedTokenItem].symbol,
                        decimals:
                          appConfig.wrappedBridge.chains[selectedChainItem]
                            .tokens[selectedTokenItem].decimals,
                        chainId:
                          appConfig.wrappedBridge.chains[selectedChainItem]
                            .chainId,
                      },
                    },
                  });
                }}
              >
                <Image src={metamask} alt="metamask" className="h-5 mr-1" />
                Add Token
              </div>
            </span>
          )}
        </div>
      )}
      {isDisabledChain && (
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
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer md:py-2 md:px-3">
              <Image
                src={
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .appLogo
                }
                alt="icon"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-base md:text-sm">
                  {
                    appConfig.wrappedBridge.disabledChains[selectedChainItem]
                      .appName
                  }
                </p>
                <p className="font-medium text-[#898888] text-sm md:text-[10px]">
                  {
                    appConfig.wrappedBridge.disabledChains[selectedChainItem]
                      .appURL
                  }
                </p>
              </div>
              <Image src={visit} alt="go" className="ml-auto" />
            </div>
          </a>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex md:flex-col">
            <div className="flex p-2 w-[10%] items-start md:p-0">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium text-sm md:text-xs md:mt-2">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
        </>
      )}
      {isThirdPartyChain && (
        <>
          <a
            href={
              appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                .appWithdrawURL
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
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer md:py-2 md:px-3">
              <Image
                src={
                  appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                    .appLogo
                }
                alt="icon"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-base md:text-sm">
                  {
                    appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                      .appName
                  }
                </p>
                <p className="font-medium text-[#898888] text-sm md:text-[10px]">
                  {
                    appConfig.wrappedBridge.thirdPartyChains[selectedChainItem]
                      .domain
                  }
                </p>
              </div>
              <Image src={visit} alt="go" className="ml-auto" />
            </div>
          </a>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex md:flex-col">
            <div className="flex p-2 w-[15%] items-start md:p-0">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium text-sm md:text-xs md:mt-2">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
        </>
      )}
      {isStargate && (
        <>
          <a
            href={stargateConfig.appWithdrawURL}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer"
          >
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer md:py-2 md:px-3">
              <Image
                src={stargateConfig.appLogo}
                alt="icon"
                height={50}
                className="rounded-md"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold text-base md:text-sm">
                  {stargateConfig.appName}
                </p>
                <p className="font-medium text-[#898888] text-sm md:text-[10px]">
                  {stargateConfig.appWithdrawURL}
                </p>
              </div>
              <Image src={visit} alt="go" className="ml-auto" />
            </div>
          </a>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex md:flex-col">
            <div className="flex p-2 w-[15%] items-start md:p-0">
              <Image src={alert} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium text-sm md:text-xs md:mt-2">
              <p>
                Remember that using 3rd party application carries risks. Fuse
                does not control the code or content of these websites.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Withdraw;
