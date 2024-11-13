import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { buildSubMenuItems, evmDecimals, signDataMessage } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BalanceStateType, fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { useAccount, useBalance, useBlockNumber, useSignMessage } from "wagmi";
import { fuse } from "wagmi/chains";
import { OperatorStateType, checkIsActivated, fetchSponsorIdBalance, fetchSponsoredTransactions, fetchTokenBalances, generateSecretApiKey, selectOperatorSlice, setIsContactDetailsModalOpen, setIsRollSecretKeyModalOpen, setIsTopupAccountModalOpen, setIsWithdrawModalOpen, validateOperator } from "@/store/operatorSlice";
import TopupAccountModal from "@/components/dashboard/TopupAccountModal";
import Image from "next/image";
import copy from "@/assets/copy-black.svg";
import NavMenu from "@/components/NavMenu";
import roll from "@/assets/roll.svg";
import RollSecretKeyModal from "@/components/dashboard/RollSecretKeyModal";
import YourSecretKeyModal from "@/components/dashboard/YourSecretKeyModal";
import TopupPaymasterModal from "@/components/dashboard/TopupPaymasterModal";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import info from "@/assets/info.svg"
import AccountCreationModal from "@/components/build/AccountCreationModal";
import CongratulationModal from "@/components/build/CongratulationModal";
import { useEthersSigner } from "@/lib/ethersAdapters/signer";
import ConnectWallet from "@/components/ConnectWallet";
import ContactDetailsModal from "@/components/build/ContactDetailsModal";
import Copy from "@/components/ui/Copy";
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";
import { fetchTokenPrice } from "@/lib/api";
import show from "@/assets/show.svg";
import hide from "@/assets/hide.svg";
import { formatUnits } from "viem";
import { SignMessageVariables } from "wagmi/query";
import contactSupport from "@/assets/contact-support.svg";
import router from "next/router";

type CreateOperatorWalletProps = {
  isValidated: boolean;
  signMessage: (variables: SignMessageVariables) => void;
  loading: () => boolean;
  dispatch: any;
}

type ConnectOperatorWalletProps = {
  signMessage: (variables: SignMessageVariables) => void;
  loading: () => boolean;
}

type OperatorAccountBalanceProps = {
  chain: any;
  balanceSlice: BalanceStateType;
  balance: any;
  operatorSlice: OperatorStateType;
  dispatch: ThunkDispatch<any, undefined, AnyAction> & Dispatch<AnyAction>;
}

const CreateOperatorWallet = ({ isValidated, signMessage, loading, dispatch }: CreateOperatorWalletProps) => {
  return (
    <div className="flex flex-col justify-between items-start md:gap-4">
      <div>
        <p className="text-2xl leading-none font-medium">
          Please create your Operator wallet.
        </p>
        <p className="text-lg leading-none text-text-dark-gray font-medium max-w-[358.29px] mt-[27.75px] mb-[17.25px]">
          Your Operator wallet enables you to finance user transactions on the network,
          ensuring a seamless experience for your end users
        </p>
      </div>
      <Button
        text="Create operator wallet"
        className="transition ease-in-out flex justify-between items-center gap-2 bg-black text-lg leading-none text-white font-semibold rounded-full hover:bg-success hover:text-black"
        padding="py-[18.5px] px-[38px]"
        onClick={() => {
          if (isValidated) {
            return dispatch(setIsContactDetailsModalOpen(true))
          }
          signMessage({ message: signDataMessage });
        }}
      >
        {loading() && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
      </Button>
    </div>
  )
}

const ConnectOperatorWallet = ({ signMessage, loading }: ConnectOperatorWalletProps) => {
  return (
    <div className="flex flex-col justify-between items-start">
      <div>
        <p className="text-2xl leading-none font-medium">
          Connect your operator wallet
        </p>
        <p className="text-lg leading-none text-text-dark-gray font-medium max-w-[358.29px] mt-[27.75px] mb-[17.25px]">
          Please click the “Connect operator wallet” button to see your operator balance
        </p>
      </div>
      <Button
        text="Connect operator wallet"
        className="transition ease-in-out flex justify-between items-center gap-2 text-lg leading-none text-white font-semibold bg-black rounded-full hover:bg-success hover:text-black"
        padding="py-[18.5px] px-[38px]"
        onClick={() => {
          signMessage({ message: signDataMessage });
        }}
      >
        {loading() && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
      </Button>
    </div>
  )
}

const ConnectEoaWallet = () => {
  return (
    <div className="flex flex-col justify-between items-start">
      <div>
        <p className="text-2xl leading-none font-medium">
          Connect your wallet
        </p>
        <p className="text-lg leading-none text-text-dark-gray font-medium max-w-[358.29px] mt-[27.75px] mb-[17.25px]">
          Please click the “Connect Wallet” button to proceed further
        </p>
      </div>
      <ConnectWallet
        className="transition ease-in-out flex justify-between items-center gap-2 bg-black text-lg leading-none text-white font-semibold rounded-full py-[18.5px] px-[38px] hover:bg-success hover:text-black"
        defaultClassName=""
      />
    </div>
  )
}

const OperatorAccountBalance = ({ chain, balanceSlice, balance, operatorSlice, dispatch }: OperatorAccountBalanceProps) => {
  useEffect(() => {
    const fiveSecondInMillisecond = 5000;

    const intervalId = setInterval(() => {
      if (operatorSlice.isActivated) {
        dispatch(withRefreshToken(() => dispatch(fetchSponsoredTransactions())));
      } else {
        dispatch(withRefreshToken(() => dispatch(checkIsActivated())));
      }
    }, fiveSecondInMillisecond);

    return () => {
      clearInterval(intervalId);
    }
  }, [dispatch, operatorSlice.isActivated])

  useEffect(() => {
    if (operatorSlice.operator.user.smartContractAccountAddress) {
      dispatch(fetchTokenBalances({ address: operatorSlice.operator.user.smartContractAccountAddress }));
    }
  }, [dispatch, operatorSlice.operator.user.smartContractAccountAddress])

  return (
    <div className="flex flex-col justify-between items-start">
      <div className="flex flex-col gap-[18px] md:mb-4">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Operator account balance
          <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
            ?
            <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
              <p className="mb-1">
                The operator account balance is needed in order to be able to use Paymaster and later pay for Premium subscriptions.
              </p>
              <p>
                You can freely deposit and withdraw any tokens available on the Fuse Network.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end md:flex-wrap gap-x-[30px] md:gap-x-4">
          {operatorSlice.isFetchingTokenBalances || balanceSlice.isUsdPriceLoading ?
            <span className="w-20 h-10 rounded-md animate-pulse bg-white/80"></span> :
            <h1 className="font-bold text-5xl leading-none whitespace-nowrap">
              ${(chain && chain.id === fuse.id) ?
              new Intl.NumberFormat().format(
                (parseFloat(balance?.formatted ?? "0") * balanceSlice.price) + operatorSlice.totalTokenBalance
              ) :
              "0.00"}
            </h1>
          }
        </div>
      </div>
      <div className="flex flex-row md:flex-wrap gap-2.5">
        <Button
          text="Deposit"
          className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:text-black hover:bg-success"
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => {
            dispatch(setIsTopupAccountModalOpen(true));
          }}
        />
        <Button
          text="Withdraw"
          className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:text-black hover:bg-success"
          padding="py-[18.5px] px-[29.5px]"
          onClick={() => {
            dispatch(setIsWithdrawModalOpen(true));
          }}
        />
      </div>
    </div>
  )
}

const Home = () => {
  const dispatch = useAppDispatch();
  const balanceSlice = useAppSelector(selectBalanceSlice);
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const controller = useMemo(() => new AbortController(), []);
  const { isConnected, address, chain } = useAccount();
  const signer = useEthersSigner();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, refetch } = useBalance({
    address: operatorSlice.operator.user.smartWalletAddress,
    chainId: fuse.id,
  });
  const totalTransaction = 1000;
  const { isPending, signMessage } = useSignMessage({
    mutation: {
      onSuccess(data) {
        if (!address) {
          return;
        }
        dispatch(validateOperator({
          signData: {
            externallyOwnedAccountAddress: address,
            message: signDataMessage,
            signature: data
          },
        }));
      }
    }
  });

  const loading = () => {
    if (
      isPending ||
      operatorSlice.isValidatingOperator ||
      operatorSlice.isFetchingOperator
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    dispatch(fetchUsdPrice({
      tokenId: "fuse-network-token",
      controller
    }))

    return () => {
      controller.abort();
    }
  }, [controller, dispatch, isConnected])

  useEffect(() => {
    dispatch(fetchSponsorIdBalance());
  }, [operatorSlice.isHydrated, operatorSlice.isFundingPaymaster, operatorSlice.isCreatingPaymaster, dispatch])

  useEffect(() => {
    (async () => {
      if (operatorSlice.isWithdrawn && operatorSlice.withdraw.amount) {
        const priceUSD = await fetchTokenPrice(operatorSlice.withdraw.coinGeckoId);
        const amountUSD = parseFloat(operatorSlice.withdraw.amount) * (typeof priceUSD === "string" ? parseFloat(priceUSD) : priceUSD);

        amplitude.track("Account Balance Withdrawn", {
          amount: operatorSlice.withdraw.amount,
          amountUSD,
          token: operatorSlice.withdraw.token
        });
      }
    })();
  }, [operatorSlice.isWithdrawn, operatorSlice.withdraw.amount, operatorSlice.withdraw.coinGeckoId, operatorSlice.withdraw.token])

  useEffect(() => {
    if (operatorSlice.isAuthenticated) {
      refetch();
    }
  }, [blockNumber, operatorSlice.isAuthenticated, refetch])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <WithdrawModal balance={formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0"} />
      <TopupPaymasterModal balance={formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals) ?? "0"} />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      {operatorSlice.isContactDetailsModalOpen && <ContactDetailsModal />}
      {operatorSlice.isAccountCreationModalOpen && <AccountCreationModal />}
      {operatorSlice.isCongratulationModalOpen && <CongratulationModal />}
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="dashboard" className="md:flex md:justify-center" />
        <div className={`flex justify-between md:flex-col gap-2 mt-[66.29px] md:mt-14 ${operatorSlice.isActivated ? "mb-[70px]" : "mb-[42px]"} md:mb-[50px]`}>
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight md:text-center">
            Operator Dashboard
          </h1>
          <div className="flex items-center gap-px md:hidden">
            <Image
              src={contactSupport}
              alt="contact support"
            />
            <div className="flex items-center gap-1">
              <p>
                Not sure what&apos;s next?
              </p>
              <button
                className="underline font-bold"
                onClick={() => {
                  amplitude.track("Contact us - Operators");
                  window.open("https://calendly.com/magali-fuse", "_blank");
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
        {(operatorSlice.isAuthenticated && !operatorSlice.isActivated) &&
          <div className="flex flex-row md:flex-col gap-4 justify-between items-center bg-lemon-chiffon rounded-[20px] px-[30px] py-[18px] mb-[30px] border border-[0.5px] border-star-dust-alpha-70">
            <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2">
              <Image
                src={info}
                alt="info"
                width={32}
                height={32}
              />
              <p className="font-medium">
                To activate Starter plan and get an API key it is required to deposit at least 10 FUSE to the Account balance
              </p>
            </div>
            <Button
              text="Add funds"
              className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black hover:text-black hover:bg-white rounded-full"
              padding="py-3.5 px-[38px]"
              onClick={() => {
                dispatch(setIsTopupAccountModalOpen(true));
              }}
            />
          </div>
        }
        <div className="flex flex-col gap-y-[30px] md:gap-y-[21px] mb-[143.32px] md:mb-[66px]">
          <div className="flex relative flex-row md:flex-col gap-x-4 gap-y-12 bg-lightest-gray justify-between rounded-[20px] p-12 md:p-8 min-h-[297px]">
        <Button
              text="Upgrade now"
              className="absolute top-[34px] right-6 md:right-4 sm:top-[75px] sm:w-[152px] w-[162px] h-[43px] py-[14px] px-5 bg-[#CCFFCC] text-black rounded-full hover:bg-black hover:text-white transition-colors text-base font-bold leading-[15.47px] text-center"
              onClick={() => router.push("/billing")}
            />
            {(!isConnected || !signer) ?
              <ConnectEoaWallet /> :
              operatorSlice.isAuthenticated ?
                <OperatorAccountBalance
                  chain={chain}
                  balanceSlice={balanceSlice}
                  balance={balance}
                  operatorSlice={operatorSlice}
                  dispatch={dispatch}
                /> :
                operatorSlice.isOperatorExist ?
                  <ConnectOperatorWallet
                    signMessage={signMessage}
                    loading={loading}
                  /> :
                  <CreateOperatorWallet
                    isValidated={operatorSlice.isValidated}
                    signMessage={signMessage}
                    loading={loading}
                    dispatch={dispatch}
                  />
            }
            <div className="flex flex-col justify-between w-[361px] md:w-auto">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray font-medium">
                  Active plan
                </p>
                <p className="font-bold text-5xl leading-none whitespace-nowrap">
                  Starter plan
                </p>
              </div>
              <div className="flex flex-col gap-[18px] w-full md:mt-[30px]">
                <div className="flex items-center gap-2.5 text-lg text-text-dark-gray font-medium">
                  Sponsored Transactions
                  <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                    ?
                    <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                      <p className="mb-1">
                        Sponsored transactions are a feature that allows you to pay for your customers gas fees.
                      </p>
                      <p>
                        Since the gas cost in the Fuse Network is very low, your customers will not have to solve
                        the gas issue on their own, you can easily take on these very small costs yourself.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10.5px]">
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat().format(operatorSlice.sponsoredTransactions)}/{new Intl.NumberFormat().format(totalTransaction)}
                  </p>
                  <div className="bg-[#BBBBBB] h-2.5 rounded-full">
                    <div
                      className="bg-success h-2.5 rounded-full"
                      style={{ width: ((operatorSlice.sponsoredTransactions) / totalTransaction) * 100 + "%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:flex-col gap-[30px] md:gap-5">
            <div className={`flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] pl-12 pt-12 pr-4 pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px] ${operatorSlice.isActivated ? "bg-black" : "bg-white"}`}>
              <div className="flex flex-col gap-4">
                <p className={`text-[20px] leading-none font-bold ${operatorSlice.isActivated ? "text-white" : "text-black"}`}>
                  Send your first transaction
                </p>
                <p className={`text-base ${operatorSlice.isActivated ? "text-white" : "text-text-dark-gray"}`}>
                  Learn how to submit your first transaction using a smart contract wallet
                </p>
              </div>
              <button
                className={`transition ease-in-out text-black leading-none font-semibold bg-modal-bg rounded-full px-7 py-4 ${operatorSlice.isActivated ? "hover:bg-success" : "border border-black/40 hover:bg-black hover:text-white hover:border-black"}`}
                onClick={() => {
                  amplitude.track("Go to Tutorials");
                  window.open("https://docs.fuse.io/developers/tutorials/send-your-first-gasless-transaction", "_blank");
                }}
              >
                Start tutorial
              </button>
            </div>
            <div className={`flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px] ${operatorSlice.isActivated ? "opacity-100" : "opacity-50"}`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-[20px] leading-none font-semibold">
                    Your API Key
                  </p>
                  <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                    ?
                    <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                      <p>
                        The Fuse Network&apos;s low cost allows for testing with the production API key.
                        For sandbox API key tests on the Spark network, reach out via chat for assistance.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API key at the next stage for integration into the SDK
                </p>
              </div>
              <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                {operatorSlice.isActivated ?
                  <>
                    <p>
                      {operatorSlice.operator.project.publicKey}
                    </p>
                    <Copy
                      src={copy}
                      text={operatorSlice.operator.project.publicKey}
                      tooltipText="API Key copied"
                      alt="copy API key"
                      width={15}
                      height={15}
                    />
                  </> :
                  <p>
                    Account not activated
                  </p>
                }
              </div>
            </div>
            <div className={`flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px] ${operatorSlice.isActivated ? "opacity-100" : "opacity-50"}`}>
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Your API secret key
                </p>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API secret key for some FuseBox APIs.
                </p>
              </div>
              {!operatorSlice.isActivated ?
                <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                  <p>
                    Account not activated
                  </p>
                </div> :
                operatorSlice.operator.project.secretLastFourChars ?
                  <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-xs text-black font-semibold px-5 py-[15px]">
                    {operatorSlice.operator.project.secretKey && showSecretKey ?
                      <p>
                        {operatorSlice.operator.project.secretKey}
                      </p> :
                      <p>
                        {operatorSlice.operator.project.secretPrefix}{new Array(20).fill("*")}{operatorSlice.operator.project.secretLastFourChars}
                      </p>
                    }
                    <div className="flex items-center gap-2">
                      {operatorSlice.operator.project.secretKey &&
                        <Image
                          src={showSecretKey ? show : hide}
                          alt="display secret key"
                          width={20}
                          height={20}
                          title="Display Secret Key"
                          className="cursor-pointer"
                          onClick={() => {
                            setShowSecretKey(!showSecretKey)
                          }}
                        />
                      }
                      <Image
                        src={roll}
                        alt="roll secret key"
                        width={15}
                        height={15}
                        title="Roll Secret Key"
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(setIsRollSecretKeyModalOpen(true));
                        }}
                      />
                    </div>
                  </div> :
                  <Button
                    text="Generate a new API secret"
                    className="transition ease-in-out flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
                    padding="py-4 px-6"
                    onClick={() => {
                      dispatch(withRefreshToken(() => dispatch(generateSecretApiKey())));
                    }}
                  >
                    {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                  </Button>
              }
            </div>
          </div>
        </div>
        <DocumentSupport />
      </div>
    </div>
  );
};

export default Home;
