/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { appConfig } from "@/lib/config";
import Dropdown from "@/components/ui/Dropdown";
import switchImg from "@/assets/switch.svg";
import fuseToken from "@/assets/tokenLogo";
import metamask from "@/assets/metamask.svg";
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
import {
  estimateDepositFee,
  estimateWithdrawFee,
  estimateWrappedFee,
  selectFeeSlice,
} from "@/store/feeSlice";
import { toggleLiquidityToast } from "@/store/toastSlice";
import * as amplitude from "@amplitude/analytics-browser";
import { useAccount } from "wagmi";
import { fetchBalance as fetchWalletBalance } from "@wagmi/core";
import { fuse } from "viem/chains";
import { hex, walletType } from "@/lib/helpers";
import { getNetwork } from "wagmi/actions";

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
  setDisplayButton: (displayButton: boolean) => void;
  pendingPromise: any;
  setPendingPromise: (pendingPromise: any) => void;
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
  setDisplayButton,
  pendingPromise,
  setPendingPromise,
}: WithdrawProps) => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const chainSlice = useAppSelector(selectChainSlice);
  const feeSlice = useAppSelector(selectFeeSlice);
  const [nativeBalance, setNativeBalance] = React.useState<string>("0");
  const { address, connector } = useAccount();
  const { chain } = getNetwork();

  useEffect(() => {
    async function updateBalance() {
      if (address) {
        const balance = await fetchWalletBalance({
          address,
          chainId: fuse.id,
        });
        setNativeBalance(balance.formatted);
      }
    }
    updateBalance();
  }, [address]);

  useEffect(() => {
    if (
      !appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isNative
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
    if (address && selectedChainSection === 0) {
      if (pendingPromise) {
        pendingPromise.abort();
      }
      const tokenAddress =
        appConfig.wrappedBridge.fuse.tokens[selectedTokenItem].address;
      const promise =
        (!tokenAddress || tokenAddress === hex) && chain?.id === fuse.id
          ? dispatch(setNativeBalanceThunk(nativeBalance.toString()))
          : dispatch(
              fetchBalance({
                address: address,
                contractAddress:
                  appConfig.wrappedBridge.fuse.tokens[selectedTokenItem]
                    .address,
                decimals:
                  appConfig.wrappedBridge.fuse.tokens[selectedTokenItem]
                    .decimals,
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
  useEffect(() => {
    if (
      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
        selectedTokenItem
      ].isNative
    ) {
      dispatch(
        estimateDepositFee({
          contractAddress:
            appConfig.wrappedBridge.chains[selectedChainItem].originalFuse,
          rpcUrl: "https://rpc.fuse.io",
        })
      );
    } else {
      dispatch(
        estimateWithdrawFee({
          contractAddress: appConfig.wrappedBridge.fuse.wrapped,
          rpcUrl: "https://rpc.fuse.io",
        })
      );
    }
  }, [selectedTokenItem, selectedChainItem]);
  return (
    <>
      {!isDisabledChain && (
        <>
          <div className="flex bg-modal-bg rounded-md p-4 mt-3 w-full flex-col">
            <span className="font-medium text-xs">
              From
              <img
                src={sFuse.src}
                alt="sFuse"
                className="inline-block ml-[6px] mr-[6px] h-5"
              />
              Fuse Network
            </span>
            <div className="flex w-full items-center mt-2">
              <div className="bg-white w-2/3 md:w-3/5 p-4 md:p-2 rounded-s-md border-[1px] border-border-gray">
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none text-sm md:text-xs"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
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
              balanceSlice.isApprovalLoading ||
              (appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                selectedTokenItem
              ].isNative &&
                chain?.id !== fuse.id) ? (
                <span className="px-10 py-1 ml-2 rounded-md animate-pulse bg-fuse-black/10"></span>
              ) : appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                  selectedTokenItem
                ].isNative && chain?.id === fuse.id ? (
                new Intl.NumberFormat().format(parseFloat(nativeBalance))
              ) : (
                balanceSlice.balance
              )}
            </span>
          </div>
          <div className="flex justify-center">
            <img
              src={switchImg.src}
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
              items: appConfig.wrappedBridge.disabledChains.map((chain, i) => {
                return {
                  item: chain.chainName,
                  icon: chain.icon,
                  id: i,
                };
              }),
            },
          ]}
          selectedSection={selectedChainSection}
          selectedItem={selectedChainItem}
          onClick={(section, item) => {
            setSelectedChainSection(section);
            setSelectedChainItem(item);
            if (section === 1) {
              setDisplayButton(false);
              setIsDisabledChain(true);
            } else {
              dispatch(setChain(appConfig.wrappedBridge.chains[item]));
              dispatch(
                estimateWrappedFee({
                  contractAddress: appConfig.wrappedBridge.fuse.wrapped,
                  lzChainId: appConfig.wrappedBridge.chains[item].lzChainId,
                  rpcUrl: "https://rpc.fuse.io",
                })
              );
              setDisplayButton(true);
              setIsDisabledChain(false);
            }
          }}
        />
        <span className="text-black/50 font-medium mt-3 text-sm flex items-center justify-between">
          <span>
            You will receive: <br />
            <span className="text-black font-medium">
              {" "}
              {amount && !isNaN(parseFloat(amount))
                ? (
                    (1 - feeSlice.withdrawFee / 10000) *
                    parseFloat(amount)
                  ).toFixed(2)
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
              // @ts-ignore
              window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                  type: "ERC20",
                  options: {
                    address:
                      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                        selectedTokenItem
                      ].address,
                    symbol:
                      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                        selectedTokenItem
                      ].symbol,
                    decimals:
                      appConfig.wrappedBridge.chains[selectedChainItem].tokens[
                        selectedTokenItem
                      ].decimals,
                    chainId:
                      appConfig.wrappedBridge.chains[selectedChainItem].chainId,
                  },
                },
              });
            }}
          >
            <img src={metamask.src} alt="metamask" className="h-5 mr-1" />
            Add Token
          </div>
        </span>
      </div>
      {isDisabledChain && (
        <>
          <div className="px-2 py-4 mt-4 mb-2 bg-warning-bg rounded-md border border-warning-border flex md:flex-col">
            <div className="flex p-2 w-[10%] items-start md:p-0">
              <img src={alert.src} alt="warning" className="h-5" />
            </div>
            <div className="flex flex-col font-medium text-sm md:text-xs md:mt-2">
              <p>
                To move tokens from Fuse to{" "}
                {
                  appConfig.wrappedBridge.disabledChains[selectedChainItem]
                    .chainName
                }{" "}
                please use{" "}
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
            <div className="flex mt-2 bg-modal-bg py-4 px-5 rounded-md items-center cursor-pointer md:py-2 md:px-3">
              <img
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
              <img src={visit.src} alt="go" className="ml-auto" />
            </div>
          </a>
        </>
      )}
    </>
  );
};

export default Withdraw;
