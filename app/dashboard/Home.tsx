import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import rightArrow from "@/assets/right-arrow.svg"
import rightArrowGray from "@/assets/right-arrow-gray.svg"
import { buildSubMenuItems, path, signDataMessage } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { BalanceStateType, fetchUsdPrice, selectBalanceSlice } from "@/store/balanceSlice";
import { useAccount, useBalance, useNetwork, useSignMessage } from "wagmi";
import { fuse } from "wagmi/chains";
import Link from "next/link";
import { createOperator, fetchOperator, fetchSponsorIdBalance, generateSecretApiKey, selectOperatorSlice, setIsRollSecretKeyModalOpen, setIsTopupAccountModalOpen, setIsTopupPaymasterModalOpen, setIsWithdrawModalOpen, validateOperator } from "@/store/operatorSlice";
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
import { Signer } from "ethers";
import { SignMessageArgs } from "wagmi/actions";
import ConnectWallet from "@/components/ConnectWallet";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

type CreateOperatorWalletProps = {
  isConnected: boolean;
  signer: Signer;
  accessToken: string;
  signMessage: (args?: SignMessageArgs | undefined) => void;
  loading: () => boolean;
  isHydrated: boolean;
  router: AppRouterInstance;
  dispatch: any;
}

type ConnectOperatorWalletProps = {
  signMessage: (args?: SignMessageArgs | undefined) => void;
  loading: () => boolean;
}

type OperatorAccountBalanceProps = {
  chain: any;
  balanceSlice: BalanceStateType;
  balance: any;
  isActivated: boolean;
  signer: Signer;
  dispatch: ThunkDispatch<any, undefined, AnyAction> & Dispatch<AnyAction>;
}

const CreateOperatorWallet = ({ isConnected, signer, accessToken, signMessage, loading, isHydrated, router, dispatch }: CreateOperatorWalletProps) => {
  const [isOperatorWalletError, setIsOperatorWalletError] = useState(false)

  useEffect(() => {
    const operatorContactDetail = localStorage.getItem("Fuse-operatorContactDetail");
    if (isHydrated && !operatorContactDetail) {
      setIsOperatorWalletError(true);
    }
  }, [isHydrated])

  return (
    <div className="flex flex-col justify-between items-start md:gap-4">
      {isOperatorWalletError ?
        <div>
          <p className="max-w-[358.29px]">
            Could not find your contact detail. Please head back
            to the Welcome page and Create your project.
          </p>
        </div> :
        <div>
          <p className="text-2xl leading-none font-medium">
            Please create your operator wallet.
          </p>
          <p className="text-lg leading-none text-text-dark-gray font-medium max-w-[358.29px] mt-[27.75px] mb-[17.25px]">
            The operator wallet allows you to fund transactions on the network
          </p>
          <a
            href="#"
            className="flex gap-1"
          >
            <p className="text-lg text-text-dark-gray font-semibold">
              Learn more
            </p>
            <Image
              src={rightArrowGray}
              alt="right arrow"
            />
          </a>
        </div>
      }
      <Button
        text={isOperatorWalletError ? "Visit Welcome page" : "Create operator wallet"}
        className="flex justify-between items-center gap-2 bg-black text-lg leading-none text-white font-semibold rounded-full"
        padding="py-[18.5px] px-[38px]"
        onClick={() => {
          if (isConnected) {
            const operatorContactDetail = localStorage.getItem("Fuse-operatorContactDetail");
            if (!operatorContactDetail) {
              return router.push(path.BUILD);
            }
            if (accessToken) {
              return dispatch(createOperator({
                signer,
                operatorContactDetail: JSON.parse(operatorContactDetail),
              }));
            }
            signMessage();
          }
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
        className="flex justify-between items-center gap-2 text-lg leading-none text-white font-semibold bg-black rounded-full"
        padding="py-[18.5px] px-[38px]"
        onClick={() => {
          signMessage();
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
        className="flex justify-between items-center gap-2 bg-black text-lg leading-none text-white font-semibold rounded-full py-[18.5px] px-[38px]"
      />
    </div>
  )
}

const OperatorAccountBalance = ({ chain, balanceSlice, balance, isActivated, signer, dispatch }: OperatorAccountBalanceProps) => {
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if(!isActivated) {
      const fiveSecondInMillisecond = 5000
      intervalId = setInterval(() => {
        dispatch(fetchOperator({ signer }));
      }, fiveSecondInMillisecond);
    }

    return () => clearInterval(intervalId);
  }, [isActivated, signer])

  return (
    <div className="flex flex-col justify-between items-start">
      <div className="flex flex-col gap-[18px] md:mb-4">
        <div className="flex items-center gap-3.5 text-lg text-text-dark-gray">
          Operator account balance
          <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
            ?
            <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl shadow-lg group-hover:block text-black text-sm font-medium">
              <p className="mb-5">
                Balance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-x-[30px] md:gap-x-4">
          <h1 className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
            {(chain && chain.id === fuse.id) ?
              new Intl.NumberFormat().format(
                parseFloat(balance.data?.formatted ?? "0")
              ) :
              0
            } FUSE
          </h1>
          {balanceSlice.isUsdPriceLoading ?
            <span className="px-10 py-2 ml-2 rounded-md animate-pulse bg-white/80"></span> :
            <p className="text-[20px]/7 font-medium">
              ${(chain && chain.id === fuse.id) ?
                new Intl.NumberFormat().format(
                  parseFloat((parseFloat(balance.data?.formatted ?? "0.00") * balanceSlice.price).toString())
                ) :
                "0.00"
              }
            </p>
          }
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-2.5">
        <Button
          text="Deposit"
          className="text-black text-white font-semibold bg-black rounded-full"
          padding="py-4 px-[52px]"
          onClick={() => {
            dispatch(setIsTopupAccountModalOpen(true));
          }}
        />
        <Button
          text="Withdraw"
          className="text-black text-white font-semibold bg-black rounded-full"
          padding="py-4 px-[52px]"
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
  const controller = new AbortController();
  const { isConnected, address } = useAccount();
  const signer = useEthersSigner();
  const { chain } = useNetwork();
  const balance = useBalance({
    address: operatorSlice.operator.user.smartContractAccountAddress,
    watch: operatorSlice.isAuthenticated,
    chainId: fuse.id,
  });
  const router = useRouter();
  const transaction = 0;
  const totalTransaction = 1000;
  const { isLoading, signMessage } = useSignMessage({
    message: signDataMessage,
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
  });

  const loading = () => {
    if (
      isLoading ||
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
  }, [isConnected])

  useEffect(() => {
    dispatch(fetchSponsorIdBalance());
  }, [operatorSlice.isHydrated, operatorSlice.isFundingPaymaster, operatorSlice.isCreatingPaymaster])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <TopupAccountModal />
      <WithdrawModal balance={balance.data?.formatted ?? "0"} />
      <TopupPaymasterModal balance={balance.data?.formatted ?? "0"} />
      <YourSecretKeyModal />
      <RollSecretKeyModal />
      {operatorSlice.isAccountCreationModalOpen && <AccountCreationModal />}
      {operatorSlice.isCongratulationModalOpen && <CongratulationModal />}
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[187px] md:w-9/10 max-w-7xl">
        <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="dashboard" className="" />
        <div className={`mt-[76.29px] ${operatorSlice.isActivated ? "mb-[70px]" : "mb-[42px]"}`}>
          <h1 className="text-5xl text-fuse-black font-semibold leading-none md:text-4xl">
            Operator Dashboard
          </h1>
        </div>
        {(operatorSlice.isAuthenticated && !operatorSlice.isActivated) &&
          <div className="flex flex-row md:flex-col gap-4 justify-between items-center bg-lemon-chiffon rounded-[20px] px-[30px] py-[18px] mb-[30px]">
            <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2">
              <Image
                src={info}
                alt="info"
                width={32}
                height={32}
              />
              <p className="font-medium">
                To activate Free plan and get an API key it is required to deposit at least 10 FUSE to the Account balance
              </p>
            </div>
            <Button
              text="Add funds"
              className="text-lg leading-none text-white font-semibold bg-black rounded-full"
              padding="py-[18.5px] px-[38px]"
              onClick={() => {
                dispatch(setIsTopupAccountModalOpen(true));
              }}
            />
          </div>
        }
        <div className="flex flex-col gap-y-[30px]">
          <div className="flex flex-row md:flex-col gap-x-4 gap-y-12 bg-lightest-gray justify-between rounded-[20px] p-12 md:p-8 min-h-[297px]">
            {(!isConnected || !signer) ?
              <ConnectEoaWallet /> :
              operatorSlice.isAuthenticated ?
                <OperatorAccountBalance
                  chain={chain}
                  balanceSlice={balanceSlice}
                  balance={balance}
                  isActivated={operatorSlice.isActivated}
                  signer={signer}
                  dispatch={dispatch}
                /> :
                operatorSlice.isOperatorExist ?
                  <ConnectOperatorWallet
                    signMessage={signMessage}
                    loading={loading}
                  /> :
                  <CreateOperatorWallet
                    isConnected={isConnected}
                    signer={signer}
                    accessToken={operatorSlice.accessToken}
                    signMessage={signMessage}
                    loading={loading}
                    isHydrated={operatorSlice.isHydrated}
                    router={router}
                    dispatch={dispatch}
                  />
            }
            <div className="flex flex-col justify-between w-[361px] md:w-auto">
              <div className="flex flex-col gap-[18px]">
                <p className="text-lg text-text-dark-gray">
                  Active plan
                </p>
                <p className="font-bold text-5xl leading-none md:text-3xl whitespace-nowrap">
                  Free plan
                </p>
              </div>
              <div className="flex flex-col gap-[18px] w-full">
                <div className="flex items-center gap-2.5 text-lg text-text-dark-gray">
                  Sponsored Transactions
                  <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                    ?
                    <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl shadow-lg group-hover:block text-black text-sm font-medium">
                      <p className="mb-5">
                        Transactions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10.5px]">
                  <div className="flex justify-between">
                    <p className="text-lg font-bold">{new Intl.NumberFormat().format(transaction)}</p>
                    <p className="text-lg font-bold">{new Intl.NumberFormat().format(totalTransaction)}</p>
                  </div>
                  <div className="bg-[#BBBBBB] h-2.5 rounded-full">
                    <div
                      className="bg-success h-2.5 rounded-full"
                      style={{ width: (transaction / totalTransaction) * 100 + "%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex md:flex-col gap-[30px] ${operatorSlice.isActivated ? "opacity-100" : "opacity-50"}`}>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Your API Key
                </p>
                <p className="text-text-dark-gray md:text-base">
                  You will need this API key at the next stage for integration into the SDK
                </p>
              </div>
              <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                {operatorSlice.isActivated ?
                  <>
                    <p>
                      {operatorSlice.operator.project.publicKey}
                    </p>
                    <Image
                      src={copy}
                      alt="copy API key"
                      width={15}
                      height={15}
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(operatorSlice.operator.project.publicKey);
                      }}
                    />
                  </> :
                  <p>
                    Account not activated
                  </p>
                }
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
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
                operatorSlice.operator.project.secretKey ?
                  <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                    <p>
                      {operatorSlice.operator.project.secretKey}
                    </p>
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
                  </div> : operatorSlice.operator.project.secretLastFourChars ?
                    <div className="w-full md:min-w-max flex justify-between bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
                      <p>
                        {operatorSlice.operator.project.secretPrefix}{new Array(20).fill("*")}{operatorSlice.operator.project.secretLastFourChars}
                      </p>
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
                    </div> :
                    <Button
                      text="Generate a new API secret"
                      className="flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full"
                      padding="py-4 px-6"
                      onClick={() => {
                        dispatch(generateSecretApiKey());
                      }}
                    >
                      {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
                    </Button>
              }
            </div>
            <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px]">
              <div className="flex flex-col gap-4">
                <p className="text-[20px] leading-none font-semibold">
                  Learn what you can do
                </p>
                <p className="text-text-dark-gray md:text-base">
                  The Operator&apos;s account is a single information and control panel for Operators.
                </p>
              </div>
              <div className="flex gap-8">
                <Link href={"#"} className={`${operatorSlice.isActivated ? "group" : ""} flex gap-1 text-black font-semibold`}>
                  <p>Learn more</p>
                  <img src={rightArrow.src} alt="right arrow" className={operatorSlice.isActivated ? "transition ease-in-out delay-150 group-hover:translate-x-1" : ""} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
