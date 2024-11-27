import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Footer from "@/components/bridge/Footer";
import Transactions from "@/components/bridge/Transactions";
import fuseToken from "@/assets/tokenLogo.svg";
import { appConfig } from "@/lib/config";
import { selectBalanceSlice } from "@/store/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  bridgeAndUnwrap,
  bridgeNativeTokens,
  bridgeWrappedTokens,
  selectContractSlice,
} from "@/store/contractSlice";
import { setChain } from "@/store/chainSlice";
import Button from "@/components/ui/Button";
import { fetchBridgeTransactions } from "@/store/transactionsSlice";
import {
  estimateOriginalFee,
  estimateWrappedFee,
  selectFeeSlice,
} from "@/store/feeSlice";
import { getNativeCurrency } from "@layerzerolabs/ui-core";
import { getChainKey } from "@layerzerolabs/lz-sdk";
import ToastPane from "@/components/bridge/ToastPane";
import { useAccount, useBalance, useBlockNumber, useConfig } from "wagmi";
import { fuse } from "viem/chains";
import { getAccount, switchChain } from "wagmi/actions";
import { hex, walletType } from "@/lib/helpers";
import "@/styles/bridge.css";
import {
  selectSelectedChainSlice,
  setDepositChainItem,
  setWithdrawChainItem,
} from "@/store/selectedChainSlice";
import { formatUnits } from "viem";
import { getTokenOnFuse } from "@/lib/helper-bridge";
import {
  initiateBridgeTransaction,
  initiateWithdrawTransaction,
  selectChargeSlice,
} from "@/store/chargeSlice";

const Home = () => {
  const selectedChainSlice = useAppSelector(selectSelectedChainSlice);
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const contractSlice = useAppSelector(selectContractSlice);
  const [selected, setSelected] = useState(0);
  const [depositSelectedChainSection, setDepositSelectedChainSection] =
    useState(0);
  const setDepositSelectedChainItem = (item: number) => {
    dispatch(setDepositChainItem(item));
  };
  const [depositSelectedTokenSection, setDepositSelectedTokenSection] =
    useState(0);
  const [depositSelectedTokenItem, setDepositSelectedTokenItem] = useState(0);
  const [displayButton, setDisplayButton] = useState(true);
  const [withdrawSelectedChainSection, setWithdrawSelectedChainSection] =
    useState(0);
  const setWithdrawSelectedChainItem = (item: number) => {
    dispatch(setWithdrawChainItem(item));
  };
  const [withdrawSelectedTokenSection, setWithdrawSelectedTokenSection] =
    useState(0);
  const [withdrawSelectedTokenItem, setWithdrawSelectedTokenItem] = useState(0);
  const [amount, setAmount] = useState("");
  const filters = ["Deposit", "Withdraw", "History"];
  const [isOpen, setIsOpen] = useState(false);
  const [isExchange, setIsExchange] = useState(false);
  const [isDisabledChain, setIsDisabledChain] = useState(false);
  const [isThirdPartyChain, setIsThirdPartyChain] = useState(false);
  const [pendingPromise, setPendingPromise] = React.useState<any>();
  const { address, connector, isConnected } = useAccount();
  const config = useConfig();
  const { chainId } = getAccount(config);
  const chain = config.chains.find((chain) => chain.id === chainId);
  const { data: balance } = useBalance({
    address,
  });
  const { failureCount } = useBlockNumber({
    watch: true,
  });
  const chargeSlice = useAppSelector(selectChargeSlice);

  useEffect(() => {
    setAmount("");
  }, [depositSelectedTokenItem, withdrawSelectedTokenItem]);

  useEffect(() => {
    if (address) {
      dispatch(fetchBridgeTransactions(address));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  const feeSlice = useAppSelector(selectFeeSlice);
  useEffect(() => {
    if (!contractSlice.isBridgeLoading) {
      setAmount("");
    }
  }, [contractSlice.isBridgeLoading]);

  const deposit = () => {
    dispatch(
      initiateBridgeTransaction({
        chainId:
          appConfig.wrappedBridge.chains[
            selectedChainSlice.depositSelectedChainItem
          ].chainId,
        token: chargeSlice.tokens[depositSelectedTokenItem].symbol,
        amount,
        destinationWallet: address ?? hex,
        isNative: chargeSlice.tokens[depositSelectedTokenItem].isNative,
      })
    );
  };

  const handleDeposit = () => {
    const selectedChainId =
      appConfig.wrappedBridge.chains[
        selectedChainSlice.depositSelectedChainItem
      ].chainId;
    if (selectedChainId == chain?.id) {
      deposit();
      return;
    }
    switchChain(config, { chainId: selectedChainId }).then((res) => {
      if (res) {
        deposit();
      }
    });
  };

  const withdraw = (res: any) => {
    dispatch(
      initiateWithdrawTransaction({
        chainId:
          appConfig.wrappedBridge.chains[
            selectedChainSlice.withdrawSelectedChainItem
          ].chainId,
        token: chargeSlice.tokens[withdrawSelectedTokenItem].symbol,
        amount,
        destinationWallet: address ?? hex,
        isNative: chargeSlice.tokens[withdrawSelectedTokenItem].isNative,
      })
    );
  };

  const handleWithdraw = () => {
    if (chain?.id === fuse.id) {
      withdraw(true);
      return;
    }
    switchChain(config, {
      chainId: fuse.id,
    }).then((res) => {
      if (res) {
        withdraw(res);
      }
    });
  };

  const checkBalance = () => {
    return (
      parseFloat(
        formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? 18)
      ) >=
      feeSlice.destGasFee + feeSlice.sourceGasFee
    );
  };

  return (
    <>
      <Transactions isOpen={isOpen} onToggle={setIsOpen} />
      <div className="flex flex-col main w-8/9 md:w-9/10 max-w-7xl md:flex-col">
        <div className="flex justify-between relative flex-col">
          <div className="flex flex-col pt-8 max-w-[550px] me-[100px] md:w-full">
            <span className="flex items-center">
              <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-[32px]">
                Bridge
              </h1>
            </span>
            <p className="text-text-heading-gray text-base mt-4">
              The Fuse Bridge allows you to move funds from different networks
              and centralized exchanges to Fuse.
            </p>
          </div>
          <div className="flex w-full">
            <div className="w-3/5 h-full">
              <ToastPane className="xl:hidden" />
            </div>
            <div className="w-2/5 flex-col items-center flex pt-8 md:w-full md:pt-0 md:mt-3 max-w-[500px] xl:mx-auto">
              <motion.div className="flex bg-white w-[500px] rounded-t-[20px] px-[30px] py-[26px] flex-col max-w-full md:p-5">
                <div className="flex w-full p-[2px]">
                  {filters.map((filter, index) => {
                    return (
                      <motion.p
                        className={
                          selected === index
                            ? "text-primary font-bold py-[18px] rounded-full cursor-pointer px-6 bg-modal-bg text-center text-lg md:text-sm"
                            : "text-primary font-bold py-[18px] rounded-full cursor-pointer px-6 text-center text-lg md:text-sm"
                        }
                        onClick={() => {
                          setSelected(index);
                          if (isExchange) return;
                          if (index === 1) {
                            if (withdrawSelectedChainSection === 1) {
                              setIsDisabledChain(true);
                              return;
                            } else if (withdrawSelectedChainSection === 2) {
                              setIsThirdPartyChain(true);
                              return;
                            } else {
                              setIsDisabledChain(false);
                              setIsThirdPartyChain(false);
                            }
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
                            dispatch(
                              estimateWrappedFee({
                                contractAddress:
                                  appConfig.wrappedBridge.fuse.wrapped,
                                lzChainId:
                                  appConfig.wrappedBridge.chains[
                                    selectedChainSlice.withdrawSelectedChainItem
                                  ].lzChainId,
                                rpcUrl: "https://rpc.fuse.io",
                                tokenId: "fuse-network-token",
                              })
                            );
                          } else {
                            if (depositSelectedChainSection === 1) {
                              setIsDisabledChain(true);
                              return;
                            } else if (depositSelectedChainSection === 2) {
                              setIsThirdPartyChain(true);
                              return;
                            } else {
                              setIsDisabledChain(false);
                              setIsThirdPartyChain(false);
                            }
                            dispatch(
                              setChain(
                                appConfig.wrappedBridge.chains[
                                  selectedChainSlice.depositSelectedChainItem
                                ]
                              )
                            );
                            dispatch(
                              estimateOriginalFee({
                                contractAddress:
                                  appConfig.wrappedBridge.chains[
                                    selectedChainSlice.depositSelectedChainItem
                                  ].original,
                                rpcUrl:
                                  appConfig.wrappedBridge.chains[
                                    selectedChainSlice.depositSelectedChainItem
                                  ].rpcUrl,
                                tokenId:
                                  appConfig.wrappedBridge.chains[
                                    selectedChainSlice.depositSelectedChainItem
                                  ].gasTokenId ||
                                  appConfig.wrappedBridge.chains[
                                    selectedChainSlice.depositSelectedChainItem
                                  ].tokenId,
                              })
                            );
                          }
                        }}
                        key={index}
                      >
                        {filter}
                      </motion.p>
                    );
                  })}
                </div>
                {selected === 0 ? (
                  <Deposit
                    selectedChainItem={
                      selectedChainSlice.depositSelectedChainItem
                    }
                    selectedChainSection={depositSelectedChainSection}
                    setSelectedChainItem={setDepositSelectedChainItem}
                    setSelectedChainSection={setDepositSelectedChainSection}
                    selectedTokenItem={depositSelectedTokenItem}
                    selectedTokenSection={depositSelectedTokenSection}
                    setSelectedTokenItem={setDepositSelectedTokenItem}
                    setSelectedTokenSection={setDepositSelectedTokenSection}
                    onSwitch={(
                      tokenSection,
                      tokenItem,
                      chainSection,
                      chainItem
                    ) => {
                      setWithdrawSelectedChainSection(chainSection);
                      setWithdrawSelectedChainItem(chainItem);
                      setWithdrawSelectedTokenSection(tokenSection);
                      setWithdrawSelectedTokenItem(tokenItem);
                      setSelected(1);
                    }}
                    amount={amount}
                    setAmount={setAmount}
                    setDisplayButton={setDisplayButton}
                    isExchange={isExchange}
                    setIsExchange={setIsExchange}
                    isDisabledChain={isDisabledChain}
                    setIsDisabledChain={setIsDisabledChain}
                    isThirdPartyChain={isThirdPartyChain}
                    setIsThirdPartyChain={setIsThirdPartyChain}
                    pendingPromise={pendingPromise}
                    setPendingPromise={setPendingPromise}
                  />
                ) : (
                  <Withdraw
                    selectedChainItem={
                      selectedChainSlice.withdrawSelectedChainItem
                    }
                    selectedChainSection={withdrawSelectedChainSection}
                    setSelectedChainItem={setWithdrawSelectedChainItem}
                    setSelectedChainSection={setWithdrawSelectedChainSection}
                    selectedTokenItem={withdrawSelectedTokenItem}
                    selectedTokenSection={withdrawSelectedTokenSection}
                    setSelectedTokenItem={setWithdrawSelectedTokenItem}
                    setSelectedTokenSection={setWithdrawSelectedTokenSection}
                    onSwitch={(
                      tokenSection,
                      tokenItem,
                      chainSection,
                      chainItem
                    ) => {
                      setDepositSelectedChainSection(chainSection);
                      setDepositSelectedChainItem(chainItem);
                      setDepositSelectedTokenSection(tokenSection);
                      setDepositSelectedTokenItem(tokenItem);
                      setSelected(0);
                    }}
                    amount={amount}
                    setAmount={setAmount}
                    isDisabledChain={isDisabledChain}
                    setIsDisabledChain={setIsDisabledChain}
                    isThirdPartyChain={isThirdPartyChain}
                    setIsThirdPartyChain={setIsThirdPartyChain}
                    setDisplayButton={setDisplayButton}
                    pendingPromise={pendingPromise}
                    setPendingPromise={setPendingPromise}
                  />
                )}
                {!isConnected && displayButton ? (
                  <ConnectWallet className="transition ease-in-out mt-6 py-4 w-full hover:bg-success hover:text-black" />
                ) : failureCount > 0 ? (
                  <Button
                    className="bg-[#FFEBE9] text-[#FD0F0F] px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                    disabled
                    text="Sorry, RPC is too busy. Please come back later."
                  />
                ) : displayButton &&
                  (selected === 0
                    ? chain?.id !==
                      appConfig.wrappedBridge.chains[
                        selectedChainSlice.depositSelectedChainItem
                      ].chainId
                    : chain?.id !== fuse.id) ? (
                  <Button
                    className="bg-fuse-black text-white px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                    text={
                      selected === 0
                        ? "Switch to " +
                          appConfig.wrappedBridge.chains[
                            selectedChainSlice.depositSelectedChainItem
                          ].name
                        : "Switch to Fuse"
                    }
                    onClick={() => {
                      if (selected === 0)
                        switchChain(config, {
                          chainId:
                            appConfig.wrappedBridge.chains[
                              selectedChainSlice.depositSelectedChainItem
                            ].chainId,
                        });
                      else
                        switchChain(config, {
                          chainId: fuse.id,
                        });
                    }}
                  />
                ) : (displayButton &&
                    parseFloat(amount) > parseFloat(balanceSlice.balance)) ||
                  (!checkBalance() && parseFloat(amount) > 0) ? (
                  // || parseFloat(amount) > 10000
                  // || parseFloat(amount) < 0.5
                  <Button
                    className="bg-[#FFEBE9] text-[#FD0F0F] px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                    disabled
                    text={
                      parseFloat(amount) > parseFloat(balanceSlice.balance)
                        ? `Insufficient ${
                            chargeSlice.tokens[
                              selected
                                ? withdrawSelectedTokenItem
                                : depositSelectedTokenItem
                            ].symbol
                          } Balance`
                        : !checkBalance()
                        ? `Insufficient ${balance?.symbol} for gas fee`
                        : parseFloat(amount) > 10000
                        ? "Exceeds Daily Limit"
                        : "Minimum 0.5"
                    }
                  />
                ) : (
                  displayButton && (
                    <Button
                      className="bg-fuse-black text-white px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                      onClick={async () => {
                        if (selected === 1 && chain?.id !== fuse.id) {
                          await switchChain(config, {
                            chainId: fuse.id,
                          });
                        } else {
                          if (!isConnected) return;
                          if (!amount) return;
                          if (selected === 1) {
                            handleWithdraw();
                          } else if (selected === 0) {
                            handleDeposit();
                          }
                        }
                      }}
                      disabled={
                        chargeSlice.isBridgeLoading ||
                        !amount ||
                        parseFloat(amount) === 0 ||
                        isNaN(parseFloat(amount))
                      }
                      text="Bridge"
                      disabledClassName="bg-fuse-black/20 text-black px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                    />
                  )
                )}
              </motion.div>
              {!(isExchange || isDisabledChain || isThirdPartyChain) && (
                <motion.div className="flex bg-white w-[525px] rounded-b-[20px] px-8 pb-7 flex-col font-medium text-sm max-w-full md:text-xs">
                  <div className="flex justify-between">
                    <span className="text-black/50">Bridge Fee</span>
                    {chargeSlice.isLoading ? (
                      <span className="px-14 rounded-md animate-pulse bg-fuse-black/10"></span>
                    ) : (
                      <span>${chargeSlice.totalFeeUSD}</span>
                    )}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-black/50 flex relative">
                      Gas Estimation{" "}
                      <div className="peer cursor-pointer h-4 w-4 bg-lightest-gray rounded-full flex justify-center ml-1 text-black">
                        ?
                      </div>
                      <div className="tooltip-text hidden bottom-8 -left-[30px] absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg peer-hover:block text-black text-sm font-medium">
                        <p className="mb-5">
                          The Gas fee covers the source and destination
                          blockchains transaction fees paid by Layer Zero.
                        </p>
                        <p>
                          Source Gas fee:{" "}
                          <span className="font-bold">
                            $
                            {(
                              feeSlice.sourceGasFee * feeSlice.tokenPrice
                            ).toFixed(5)}
                          </span>
                        </p>
                        <p>
                          Destination Gas fee:{" "}
                          <span className="font-bold">
                            $
                            {(
                              feeSlice.destGasFee * feeSlice.tokenPrice
                            ).toFixed(5)}
                          </span>
                        </p>
                      </div>
                    </span>
                    {feeSlice.isGasFeeLoading ? (
                      <span className="px-14 rounded-md animate-pulse bg-fuse-black/10"></span>
                    ) : !(
                        isExchange ||
                        isDisabledChain ||
                        isThirdPartyChain
                      ) ? (
                      <span>
                        {(feeSlice.destGasFee + feeSlice.sourceGasFee).toFixed(
                          5
                        )}{" "}
                        {
                          getNativeCurrency(
                            getChainKey(
                              selected === 0
                                ? appConfig.wrappedBridge.chains[
                                    selectedChainSlice.depositSelectedChainItem
                                  ].lzChainId
                                : 138
                            )
                          ).symbol
                        }
                        {" (~$" +
                          (
                            (feeSlice.destGasFee + feeSlice.sourceGasFee) *
                            feeSlice.tokenPrice
                          ).toFixed(5) +
                          ")"}
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* <div className="flex justify-between mt-2">
              <span className="text-black/50">Daily Limits</span>
              <span>0.5 Min - 10,000 max</span>
            </div> */}
                </motion.div>
              )}
              {/* <ToastPane className="hidden xl:flex" />
            <Airdrop />
            <FAQ /> */}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
