import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Footer from "@/components/bridge/Footer";
import history from "@/assets/history.svg";
import Transactions from "@/components/bridge/Transactions";
import fuseToken from "@/assets/tokenLogo";
import { appConfig } from "@/lib/config";
import { selectBalanceSlice } from "@/store/balanceSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  bridgeAndUnwrap,
  bridgeNativeTokens,
  bridgeOriginalTokens,
  bridgeWrappedTokens,
  increaseERC20Allowance,
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
import Pill from "@/components/bridge/Pill";
import { useAccount } from "wagmi";
import { fuse } from "viem/chains";
import { getNetwork, switchNetwork } from "wagmi/actions";
import { hex, walletType } from "@/lib/helpers";
import FAQ from "@/components/FAQ";
import "@/styles/bridge.css";
import { bridgeAndUnwrapNative } from "@/lib/wrappedBridge";
import Airdrop from "@/components/bridge/Airdrop";

const faqs = [
  "I have USDC or WETH on the Fuse network and want to bridge it to another network. But the Bridge shows me a balance of 0.",
  "I deposited USDC or WETH into the Fuse network, but I don't see the tokens in my wallet.",
  "What are Fuse token addresses on Polygon, Optimism and Arbitrum?",
  "What tokens can be transferred using the Fuse Token Bridge?",
  "Between which networks can the tokens be transferred?",
  "Is there a guide available on how to use the Fuse Token Bridge?",
  "What is the native token of the Fuse Network?",
  "What technology powers the Fuse bridge, and who monitors its security?",
  "Are there any fees associated with using the Fuse Token Bridge?",
  "Is there any liquidity concern users should know?",
  "How are gas fees on Fuse Network calculated?",
];

const faqAnswers = [
  <p key="one">
    The Fuse Bridge uses other tokens USDC V2 and WETH V2 on the bridge.
    Don&apos;t worry, their value is identical to standard USDC and WETH on the
    Fuse network.
    <br />
    So first you need to swap your USDC/WETH tokens for USDC V2/WETH V2 on the{" "}
    <a href="https://app.voltage.finance/#/swap" className="underline">
      Voltage Finance dapp
    </a>{" "}
    and then bridge tokens from Fuse to another network.
  </p>,
  <p key="two">
    By depositing USDC or WETH into the Fuse network, you receive new tokens
    which exist specifically for the bridge. Therefore, to see them in your
    wallet, you need to add them. You can use the &quot;Add Token&quot; button
    or add them manually using the contract address.
    <br />
    USDC V2 contract address:{" "}
    <a
      href="https://explorer.fuse.io/token/0x28C3d1cD466Ba22f6cae51b1a4692a831696391A/token-transfers"
      className="underline"
    >
      0x28c3d1cd466ba22f6cae51b1a4692a831696391a
    </a>
    <br />
    WETH V2 contract address:{" "}
    <a
      href="https://explorer.fuse.io/token/0x5622F6dC93e08a8b717B149677930C38d5d50682/token-transfers"
      className="underline"
    >
      0x5622f6dc93e08a8b717b149677930c38d5d50682
    </a>
    <br />
    After that, you can swap these tokens for standard USDC and WETH on Fuse on
    the Voltage Finance dapp:{" "}
    <a href="https://app.voltage.finance/#/swap" className="underline">
      https://app.voltage.finance/#/swap
    </a>
  </p>,
  <p key="three">
    Optimistic (OP): 0xe453d6649643F1F460C371dC3D1da98F7922fe51
    <br />
    <a
      href="https://optimistic.etherscan.io/token/0xe453d6649643f1f460c371dc3d1da98f7922fe51"
      className="underline"
    >
      https://optimistic.etherscan.io/token/0xe453d6649643f1f460c371dc3d1da98f7922fe51
    </a>
    <br />
    Arbitrum (ARB): 0x6b021b3f68491974bE6D4009fEe61a4e3C708fD6
    <br />
    <a
      href="https://arbiscan.io/token/0x6b021b3f68491974be6d4009fee61a4e3c708fd6"
      className="underline"
    >
      https://arbiscan.io/token/0x6b021b3f68491974be6d4009fee61a4e3c708fd6
    </a>
    <br />
    Polygon (MATIC): 0x6b021b3f68491974bE6D4009fEe61a4e3C708fD6
    <br />
    <a
      href="https://polygonscan.com/token/0x6b021b3f68491974be6d4009fee61a4e3c708fd6"
      className="underline"
    >
      https://polygonscan.com/token/0x6b021b3f68491974be6d4009fee61a4e3c708fd6
    </a>
  </p>,
  <p key="four">The Fuse Token Bridge can send FUSE, USDC, and WETH tokens.</p>,
  <p key="five">
    The tokens can be transferred between the Fuse Network and Polygon,
    Optimism, and Arbitrum.
  </p>,
  <p key="six">
    Yes, a guide on how to use the Fuse Token Bridge is available on the
    provided link.{" "}
    <a
      href="https://youtu.be/LUsoAdsTWM4?si=LuOxRsTlMZ9RSsHh"
      className="underline"
    >
      https://youtu.be/LUsoAdsTWM4?si=LuOxRsTlMZ9RSsHh
    </a>
  </p>,
  <p key="seven">
    The native token of the Fuse Network is the Fuse token (FUSE).
  </p>,
  <p key="eight">
    The token bridge is powered by LayerZero technology, and its security is
    monitored by blockchain security experts Ironblocks.
  </p>,
  <p key="nine">
    Currently, there are zero bridge fees on the Fuse Token Bridge.
  </p>,
  <p key="ten">
    Users should be aware that liquidity at this stage is minimal, so they are
    advised to avoid trying to bridge substantial amounts.
  </p>,
  <p key="eleven">
    Blockchain gas fees are calculated based on the complexity of the
    transaction or contract interaction on the network. Every operation, such as
    sending tokens, interacting with a contract, or transferring assets,
    requires a certain amount of computational work measured in &quot;gas.&quot;
    <br />
    The total gas fee is determined by multiplying the gas used by the gas
    price, which is set by the user and measured in units like gwei for
    Ethereum.
  </p>,
];

const Home = () => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const contractSlice = useAppSelector(selectContractSlice);
  const [selected, setSelected] = useState(0);
  const [depositSelectedChainSection, setDepositSelectedChainSection] =
    useState(0);
  const [depositSelectedChainItem, setDepositSelectedChainItem] = useState(0);
  const [depositSelectedTokenSection, setDepositSelectedTokenSection] =
    useState(0);
  const [depositSelectedTokenItem, setDepositSelectedTokenItem] = useState(0);
  const [displayButton, setDisplayButton] = useState(true);
  const [withdrawSelectedChainSection, setWithdrawSelectedChainSection] =
    useState(0);
  const [withdrawSelectedChainItem, setWithdrawSelectedChainItem] = useState(0);
  const [withdrawSelectedTokenSection, setWithdrawSelectedTokenSection] =
    useState(0);
  const [withdrawSelectedTokenItem, setWithdrawSelectedTokenItem] = useState(0);
  const [amount, setAmount] = useState("");
  const filters = ["Deposit", "Withdraw"];
  const [isOpen, setIsOpen] = useState(false);
  const [isExchange, setIsExchange] = useState(false);
  const [isDisabledChain, setIsDisabledChain] = useState(false);
  const [pendingPromise, setPendingPromise] = React.useState<any>();
  const { address, connector, isConnected } = useAccount();
  const { chain } = getNetwork();

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
  const increaseAllowance = (res: any, selectedChainId: number) => {
    if (res && selected === 0)
      dispatch(
        increaseERC20Allowance({
          contractAddress:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
              depositSelectedTokenItem
            ].address,
          amount: amount,
          bridge:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].original,
          decimals:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
              depositSelectedTokenItem
            ].decimals,
          address: address ?? hex,
          type: 0,
          network:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].name,
          token:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
              depositSelectedTokenItem
            ].symbol,
          tokenId:
            appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
              depositSelectedTokenItem
            ].coinGeckoId,
          selectedChainId,
          walletType: connector ? walletType[connector.id] : undefined,
        })
      );
    else if (res && selected === 1)
      dispatch(
        increaseERC20Allowance({
          contractAddress:
            appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
              .address,
          amount: amount,
          bridge: appConfig.wrappedBridge.fuse.wrapped,
          decimals:
            appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
              .decimals,
          address: address ?? hex,
          type: 1,
          network: "Fuse",
          token:
            appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
              .symbol,
          tokenId:
            appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
              .coinGeckoId,
          selectedChainId,
          walletType: connector ? walletType[connector.id] : undefined,
        })
      );
  };
  const handleIncreaseAllowance = () => {
    const selectedChainId =
      selected === 0
        ? appConfig.wrappedBridge.chains[depositSelectedChainItem].chainId
        : fuse.id;
    if (selectedChainId == chain?.id) {
      increaseAllowance(true, selectedChainId);
      return;
    }
    switchNetwork({ chainId: selectedChainId }).then((res) => {
      if (res) {
        increaseAllowance(res, selectedChainId);
      }
    });
  };

  const deposit = (res: any, selectedChainId: number) => {
    if (res) {
      if (
        appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
          depositSelectedTokenItem
        ].isBridged &&
        appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
          depositSelectedTokenItem
        ].isNative
      ) {
        dispatch(
          bridgeAndUnwrap({
            address: address ?? hex,
            amount: amount,
            bridge:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].wrapped,
            contractAddress:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].address,
            decimals:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].decimals,
            srcChainId:
              appConfig.wrappedBridge.chains[depositSelectedChainItem]
                .lzChainId,
            symbol:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].symbol,
            chainId: 138,
            network:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].name,
            tokenId: "fuse-network-token",
            selectedChainId,
            walletType: connector ? walletType[connector.id] : undefined,
          })
        );
      } else if (
        appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
          depositSelectedTokenItem
        ].isNative
      ) {
        dispatch(
          bridgeNativeTokens({
            address: address ?? hex,
            amount: amount,
            bridge:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].original,
            decimals:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].decimals,
            srcChainId:
              appConfig.wrappedBridge.chains[depositSelectedChainItem]
                .lzChainId,
            symbol:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].symbol,
            dstChainId: 138,
            network:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].name,
            tokenId:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].coinGeckoId,
            selectedChainId,
            walletType: connector ? walletType[connector.id] : undefined,
          })
        );
      } else if (
        !appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
          depositSelectedTokenItem
        ].isBridged
      )
        dispatch(
          bridgeOriginalTokens({
            address: address ?? hex,
            amount: amount,
            bridge:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].original,
            contractAddress:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].address,
            decimals:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].decimals,
            srcChainId:
              appConfig.wrappedBridge.chains[depositSelectedChainItem]
                .lzChainId,
            symbol:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].symbol,
            dstChainId: 138,
            network:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].name,
            tokenId:
              appConfig.wrappedBridge.chains[depositSelectedChainItem].tokens[
                depositSelectedTokenItem
              ].coinGeckoId,
            selectedChainId,
            walletType: connector ? walletType[connector.id] : undefined,
          })
        );
    }
  };

  const handleDeposit = () => {
    const selectedChainId =
      appConfig.wrappedBridge.chains[depositSelectedChainItem].chainId;
    if (selectedChainId == chain?.id) {
      deposit(true, selectedChainId);
      return;
    }
    switchNetwork({ chainId: selectedChainId }).then((res) => {
      if (res) {
        deposit(res, selectedChainId);
      }
    });
  };

  const withdraw = (res: any, selectedChainId: number) => {
    if (res) {
      if (
        appConfig.wrappedBridge.chains[withdrawSelectedChainItem].tokens[
          withdrawSelectedTokenItem
        ].isNative &&
        appConfig.wrappedBridge.chains[withdrawSelectedChainItem].tokens[
          withdrawSelectedTokenItem
        ].isBridged
      ) {
        dispatch(
          bridgeNativeTokens({
            address: address ?? hex,
            amount: amount,
            bridge:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem]
                .originalFuse,
            decimals:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem].tokens[
                withdrawSelectedTokenItem
              ].decimals,
            dstChainId:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem]
                .lzChainId,
            srcChainId: 138,
            symbol: "FUSE",
            network:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem].name,
            tokenId: "fuse-network-token",
            walletType: connector ? walletType[connector.id] : undefined,
            selectedChainId: fuse.id,
          })
        );
      } else if (
        appConfig.wrappedBridge.chains[withdrawSelectedChainItem].tokens[
          withdrawSelectedTokenItem
        ].isNative &&
        !appConfig.wrappedBridge.chains[withdrawSelectedChainItem].tokens[
          withdrawSelectedTokenItem
        ].isBridged
      ) {
        dispatch(
          bridgeAndUnwrap({
            address: address ?? hex,
            amount: amount,
            bridge: appConfig.wrappedBridge.fuse.wrapped,
            contractAddress:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .address,
            decimals:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .decimals,
            chainId:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem]
                .lzChainId,
            symbol:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .symbol,
            srcChainId: 138,
            network:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem].name,
            tokenId:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .coinGeckoId,
            walletType: connector ? walletType[connector.id] : undefined,
            selectedChainId: fuse.id,
          })
        );
      } else {
        dispatch(
          bridgeWrappedTokens({
            address: address ?? hex,
            amount: amount,
            bridge: appConfig.wrappedBridge.fuse.wrapped,
            contractAddress:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .address,
            decimals:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .decimals,
            chainId:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem]
                .lzChainId,
            symbol:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .symbol,
            srcChainId: 138,
            network:
              appConfig.wrappedBridge.chains[withdrawSelectedChainItem].name,
            tokenId:
              appConfig.wrappedBridge.fuse.tokens[withdrawSelectedTokenItem]
                .coinGeckoId,
            walletType: connector ? walletType[connector.id] : undefined,
          })
        );
      }
    }
  };

  const handleWithdraw = () => {
    if (chain?.id === fuse.id) {
      withdraw(true, fuse.id);
      return;
    }
    switchNetwork({
      chainId: fuse.id,
    }).then((res) => {
      if (res) {
        withdraw(res, fuse.id);
      }
    });
  };

  return (
    <>
      <Transactions isOpen={isOpen} onToggle={setIsOpen} />
      <div className="flex flex-col main w-8/9 md:w-9/10 max-w-7xl md:flex-col">
        <div className="flex relative md:flex-col">
          <div className="flex flex-col pt-16 w-2/3 me-[100px] md:w-full">
            <span className="flex items-center">
              <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-[32px]">
                Bridge
              </h1>
              <Pill
                text="Beta"
                type="success"
                className="ml-3 text-base font-medium"
              />
            </span>
            <p className="text-text-heading-gray text-base mt-4">
              The Fuse Bridge allows you to move funds from different networks
              and centralized exchanges to Fuse.
            </p>
            <ToastPane className="md:hidden" />
          </div>
          <div className="flex-col items-center flex pt-16 md:w-full md:pt-0 md:mt-3">
            <span
              className="flex bg-white ms-auto px-2 items-center rounded-md cursor-pointer"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <img src={history.src} alt="history" className="h-9" />
              <p className="font-medium ml-1 text-sm md:text-xs">History</p>
            </span>
            <motion.div className="flex bg-white w-[525px] mt-3 rounded-lg px-8 pt-8 pb-9 flex-col max-w-full md:p-5">
              <div className="flex w-full bg-modal-bg rounded-md p-[2px]">
                {filters.map((filter, index) => {
                  return (
                    <motion.p
                      className={
                        selected === index
                          ? "text-primary font-semibold py-2 rounded-md cursor-pointer w-1/2 bg-white text-center text-sm md:text-xs"
                          : "text-primary font-medium py-2 cursor-pointer w-1/2 text-center text-sm md:text-xs"
                      }
                      onClick={() => {
                        setSelected(index);
                        if (isExchange) return;
                        if (index === 1) {
                          if (withdrawSelectedChainSection === 1) {
                            setIsDisabledChain(true);
                            return;
                          } else {
                            setIsDisabledChain(false);
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
                                  withdrawSelectedChainItem
                                ].lzChainId,
                              rpcUrl: "https://rpc.fuse.io",
                              tokenId: "fuse-network-token",
                            })
                          );
                        } else {
                          if (depositSelectedChainSection === 1) {
                            setIsDisabledChain(true);
                            return;
                          } else {
                            setIsDisabledChain(false);
                          }
                          dispatch(
                            setChain(
                              appConfig.wrappedBridge.chains[
                                depositSelectedChainItem
                              ]
                            )
                          );
                          dispatch(
                            estimateOriginalFee({
                              contractAddress:
                                appConfig.wrappedBridge.chains[
                                  depositSelectedChainItem
                                ].original,
                              rpcUrl:
                                appConfig.wrappedBridge.chains[
                                  depositSelectedChainItem
                                ].rpcUrl,
                              tokenId:
                                appConfig.wrappedBridge.chains[
                                  depositSelectedChainItem
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
                  selectedChainItem={depositSelectedChainItem}
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
                  pendingPromise={pendingPromise}
                  setPendingPromise={setPendingPromise}
                />
              ) : (
                <Withdraw
                  selectedChainItem={withdrawSelectedChainItem}
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
                  setDisplayButton={setDisplayButton}
                  pendingPromise={pendingPromise}
                  setPendingPromise={setPendingPromise}
                />
              )}
              {!isConnected && displayButton ? (
                <ConnectWallet
                  className="mt-6 py-4 w-full"
                  disableAccountCenter
                />
              ) : displayButton &&
                selected === 1 &&
                !appConfig.wrappedBridge.chains[withdrawSelectedChainItem]
                  .tokens[withdrawSelectedTokenItem].isNative &&
                parseFloat(amount) > parseFloat(balanceSlice.liquidity) &&
                parseFloat(amount) <= parseFloat(balanceSlice.balance) ? (
                <Button
                  className="bg-[#FFEBE9] text-[#FD0F0F] px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                  disabled
                  text="No Liquidity"
                />
              ) : displayButton &&
                parseFloat(amount) > parseFloat(balanceSlice.balance) ? (
                // || parseFloat(amount) > 10000
                // || parseFloat(amount) < 0.5
                <Button
                  className="bg-[#FFEBE9] text-[#FD0F0F] px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                  disabled
                  text={
                    parseFloat(amount) > parseFloat(balanceSlice.balance)
                      ? `Insufficient ${
                          appConfig.wrappedBridge.chains[
                            selected
                              ? withdrawSelectedChainItem
                              : depositSelectedChainItem
                          ].tokens[
                            selected
                              ? withdrawSelectedTokenItem
                              : depositSelectedTokenItem
                          ].symbol
                        } Balance`
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
                        await switchNetwork({
                          chainId: fuse.id,
                        });
                      } else {
                        if (!isConnected) return;
                        if (!amount) return;
                        if (
                          selected === 1 &&
                          appConfig.wrappedBridge.chains[
                            withdrawSelectedChainItem
                          ].tokens[withdrawSelectedTokenItem].isNative
                        ) {
                          handleWithdraw();
                        } else if (
                          selected === 0 &&
                          appConfig.wrappedBridge.chains[
                            depositSelectedChainItem
                          ].tokens[depositSelectedTokenItem].isNative
                        ) {
                          handleDeposit();
                        } else if (
                          parseFloat(balanceSlice.approval) < parseFloat(amount)
                        ) {
                          handleIncreaseAllowance();
                        } else if (selected === 0) {
                          handleDeposit();
                        } else if (selected === 1) {
                          handleWithdraw();
                        }
                      }
                    }}
                    disabled={
                      (selected === 1 && chain?.id === fuse.id) ||
                      selected === 0
                        ? balanceSlice.isApprovalLoading ||
                          contractSlice.isBridgeLoading ||
                          contractSlice.isApprovalLoading ||
                          balanceSlice.isBalanceLoading ||
                          !amount ||
                          parseFloat(amount) === 0 ||
                          isNaN(parseFloat(amount))
                        : false
                    }
                    text={
                      contractSlice.isBridgeLoading ||
                      contractSlice.isApprovalLoading
                        ? "Loading..."
                        : selected === 1 && chain?.id !== fuse.id
                        ? "Switch To Fuse"
                        : (selected === 1 &&
                            appConfig.wrappedBridge.chains[
                              withdrawSelectedChainItem
                            ].tokens[withdrawSelectedTokenItem].isNative) ||
                          (selected === 0 &&
                            appConfig.wrappedBridge.chains[
                              depositSelectedChainItem
                            ].tokens[depositSelectedTokenItem].isNative &&
                            !appConfig.wrappedBridge.chains[
                              depositSelectedChainItem
                            ].tokens[depositSelectedTokenItem].isBridged)
                        ? "Bridge"
                        : parseFloat(balanceSlice.approval) < parseFloat(amount)
                        ? "Approve"
                        : "Bridge"
                    }
                    disabledClassname="bg-fuse-black/20 text-black px-4 mt-6 py-4 rounded-full font-medium md:text-sm "
                  />
                )
              )}
            </motion.div>
            <motion.div className="flex bg-white w-[525px] mt-2 rounded-lg px-8 py-5 flex-col font-medium text-sm max-w-full md:text-xs mb-2">
              <div className="flex justify-between">
                <span className="text-black/50">Bridge Fee</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-black/50 flex relative">
                  Gas Estimation{" "}
                  <div className="peer cursor-pointer h-4 w-4 bg-lightest-gray rounded-full flex justify-center ml-1 text-black">
                    ?
                  </div>
                  <div className="tooltip-text hidden bottom-8 -left-[30px] absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg peer-hover:block text-black text-sm font-medium">
                    <p className="mb-5">
                      The Gas fee covers the source and destination blockchains
                      transaction fees paid by Layer Zero.
                    </p>
                    <p>
                      Source Gas fee:{" "}
                      <span className="font-bold">
                        $
                        {(feeSlice.sourceGasFee * feeSlice.tokenPrice).toFixed(
                          5
                        )}
                      </span>
                    </p>
                    <p>
                      Destination Gas fee:{" "}
                      <span className="font-bold">
                        $
                        {(feeSlice.destGasFee * feeSlice.tokenPrice).toFixed(5)}
                      </span>
                    </p>
                  </div>
                </span>
                {feeSlice.isGasFeeLoading ? (
                  <span className="px-14 rounded-md animate-pulse bg-fuse-black/10"></span>
                ) : !(isExchange || isDisabledChain) ? (
                  <span>
                    {(feeSlice.destGasFee + feeSlice.sourceGasFee).toFixed(5)}{" "}
                    {
                      getNativeCurrency(
                        getChainKey(
                          selected === 0
                            ? appConfig.wrappedBridge.chains[
                                depositSelectedChainItem
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
            <Airdrop />
            <ToastPane className="hidden md:flex" />
            <Footer />
          </div>
        </div>
        <FAQ className="mt-28 mb-16" questions={faqs} answers={faqAnswers} />
      </div>
    </>
  );
};

export default Home;
