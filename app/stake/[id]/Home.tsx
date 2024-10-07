import React, { useEffect, useState } from "react";
import copy from "@/assets/copy.svg";
import InfoCard from "@/components/staking/InfoCard";
import Pill from "@/components/staking/Pill";
import StakeCard from "../../staking/StakeCard";
import StickyBox from "react-sticky-box";
import { useAppDispatch, useAppSelector } from "@/store/store";
import link from "@/assets/link.svg";
import expandArrow from "@/assets/expand-arrow.svg";
import ReactGA from "react-ga4";
import ym from "react-yandex-metrika";
import {
  fetchDelegatedAmounts,
  fetchSelfStake,
  fetchValidators,
  selectValidatorSlice,
} from "@/store/validatorSlice";
import { eclipseAddress, hex, walletType } from "@/lib/helpers";
import Jazzicon from "react-jazzicon";
import Modal from "@/components/staking/Modal";
import FAQ from "@/components/FAQ";
import WarningModal from "@/components/staking/WarningModal";
import { delegate, withdraw } from "@/lib/contractInteract";
import { useAccount } from "wagmi";
import * as amplitude from "@amplitude/analytics-browser";
import useDeepCompareEffect, { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import Image from "next/image";
import leftArrow from "@/assets/left-arrow.svg";
import Link from "next/link";
import { fetchTokenPrice } from "@/lib/api";
import Copy from "@/components/ui/Copy";
import { useParams } from "next/navigation";
import { ValidatorType } from "@/lib/types";

const Stake = () => {
  const { id } = useParams();
  const [validator, setValidator] = useState<ValidatorType | undefined>(
    undefined
  );
  const [amount, setAmount] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const validators = useAppSelector(selectValidatorSlice);
  const [isOpen, setIsOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isWarningAcknowledge, setIsWarningAcknowledge] = useState(false);
  const { address, connector } = useAccount();

  const getAmount = () => {
    if (isNaN(parseFloat(amount as string))) return 0;
    return parseFloat(amount as string);
  };
  const handleStake = () => {
    setIsLoading(true);
    delegate(getAmount().toString(), validator?.address ?? hex)
      .then(async () => {
        dispatch(
          fetchSelfStake({
            address: address ?? hex,
            validators: [validator?.address ?? hex],
          })
        );
        ReactGA.event({
          category: "Stake",
          action: "Staked",
          value: getAmount(),
        });
        ym("reachGoal", "stake");
        amplitude.track("Stake", {
          amount: getAmount(),
          amountUSD: await fetchTokenPrice("fuse-network-token") * getAmount(),
          walletType: connector ? walletType[connector.id] : undefined,
          walletAddress: address
        });
        setAmount(null);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const handleUnstake = () => {
    setIsLoading(true);
    withdraw(getAmount().toString(), validator?.address ?? hex)
      .then(async () => {
        dispatch(
          fetchSelfStake({
            address: address ?? hex,
            validators: [validator?.address ?? hex],
          })
        );
        ReactGA.event({
          category: "Unstake",
          action: "Unstaked",
          value: getAmount(),
        });
        ym("reachGoal", "unstake");
        amplitude.track("Unstake", {
          amount: getAmount(),
          amountUSD: await fetchTokenPrice("fuse-network-token") * getAmount(),
          walletType: connector ? walletType[connector.id] : undefined,
          walletAddress: address
        });
        setAmount(null);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useDeepCompareEffect(() => {
    if (validators.validatorMetadata.length > 0) {
      setValidator(
        validators.validatorMetadata.filter(
          (v) => {
            if (typeof id === "string") {
              return v.address.toLowerCase() === id?.toLowerCase();
            }
            return v.address.toLowerCase() === id[0]?.toLowerCase();
          }
        )[0]
      );
    } else {
      dispatch(fetchValidators());
    }
  }, [id, validators]);

  useDeepCompareEffectNoCheck(() => {
    if (address && validator) {
      dispatch(
        fetchSelfStake({
          address: address,
          validators: validators.validators,
        })
      );
    } else if (!address && validator) {
      dispatch(
        fetchSelfStake({
          address: hex,
          validators: validators.validators,
        })
      );
    }
  }, [address, validator]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    "What is the Fuse Staking Dapp?",
    "What information can I see on the Staking Dapp?",
    "How do I connect to the Staking Dapp?",
    "How do I use the Staking Dapp?",
    "How are Projected Rewards calculated?",
    "When I stake my FUSE, can I unstake at any time?",
    "How do I run a validator?",
    "How can validators manage their own nodes' information?",
    "How can I learn more about Fuse Staking?",
  ];

  const faqAnswers = [
    <p key="one">
      The Fuse Staking Dapp is an application that enables users to view
      information about current validator nodes on the Fuse Network. It is
      designed to help users make informed decisions about staking their Fuse to
      validators.
    </p>,
    <p key="two">
      On the Staking Dapp, you can view the amounts staked to each particular
      validator, as well as understand the APY and stability (Up Time) of each
      validator. Additionally, you can filter validators based on different
      criteria.
    </p>,
    <p key="three">
      To interact with the Staking Dapp, you need a wallet. Click on the
      &quot;Connect Wallet&quot; button on the top right to see all available options.
      Please note that you must be connected to the Fuse network with your
      wallet.
    </p>,
    <p key="four">
      If you need help using the Staking Dapp, you can refer to our
      easy-to-follow tutorials [link to tutorials].
    </p>,
    <p key="five">
      Projected rewards depend on the total locked supply in the network at each
      checkpoint, which may vary as more FUSE tokens are staked. For details on
      staking economics, see this article.
    </p>,
    <p key="six">
      Yes, you can stake or unstake your FUSE tokens at any time, without any
      locking periods.
    </p>,
    <p key="seven">
      To become a validator, you must stake a minimum of 100K FUSE and run a
      full node. However, being a validator requires some technical knowledge,
      so if you lack it, it may be better to delegate your tokens. For more
      information on how to become a validator, please refer to{" "}
      <a
        href="https://docs.fuse.io/validators/how-to-become-a-validator/"
        className="underline"
      >
        https://docs.fuse.io/validators/how-to-become-a-validator/
      </a>
    </p>,
    <p key="eight">
      Validators can manage their own nodes&apos; information by opening a pull
      request (PR) in the repository{" "}
      <a href="https://github.com/fuseio/fuse-staking" className="underline">
        https://github.com/fuseio/fuse-staking.
      </a>
    </p>,
    <p key="nine">
      You can find out all the information about Fuse Staking in our{" "}
      <a
        href="https://docs.fuse.io/validators/participating-in-network-consensus/stake-delegate-and-withdraw"
        className="underline"
      >
        documentation
      </a>
    </p>,
  ];

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <Modal
        isOpen={isOpen}
        onToggle={setIsOpen}
        delegators={validator?.delegators}
        isLoading={validators.isDelegatedAmountLoading}
      />
      <WarningModal
        isOpen={isWarningOpen}
        onToggle={setIsWarningOpen}
        isAcknowledge={isWarningAcknowledge}
        onConfirm={(arg) => {
          setIsWarningAcknowledge(arg);
          if (arg) handleUnstake();
        }}
        minStake={validators.minStakeAmount}
      />
      <div className="flex w-8/9 flex-col md:w-9/10 max-w-7xl">
        <div className="flex justify-between w-full xl:flex-col">
          <div className="w-[647px] flex flex-col md:w-full">
            <Link href="/staking" className="flex gap-[13.41px] mt-16 mb-[33.5px] hover:opacity-70">
              <Image
                src={leftArrow}
                alt="back"
                width={11.39}
                height={5.7}
              />
              Back
            </Link>
            <div className="flex items-start justify-start md:flex-col">
              <div className="w-2/3 flex justify-start h-20 md:w-full">
                <div className="h-20">
                  {!validator ? (
                    <div className="h-20 w-20 rounded-md bg-dark-gray animate-pulse"></div>
                  ) : validator.image ? (
                    <Image
                      src={`/${validator.image}`}
                      alt="validator"
                      width="78"
                      height="78"
                      className="rounded-md"
                    />
                  ) : (
                    <Jazzicon
                      diameter={78}
                      seed={parseInt(validator.name as string, 16)}
                    />
                  )}
                </div>
                <div className="flex flex-col h-full justify-between ms-6">
                  {validator ? (
                    <p className="font-semibold text-5xl text-fuse-black leading-none md:text-2xl">
                      {validator.name?.includes(hex) ? eclipseAddress(validator.name) : validator.name}
                    </p>
                  ) : (
                    <p className="px-28 py-5 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                  {validator ? (
                    <span className="text-text-dark-gray text-base flex">
                      {eclipseAddress(id as string)}
                      <Copy
                        src={copy}
                        alt="Copy"
                        className="ms-2 cursor-pointer"
                        text={validator.address}
                      />
                    </span>
                  ) : (
                    <span className="px-14 py-3 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center w-1/3 h-full ms-6 md:w-full md:items-start md:ms-0 md:mt-8 whitespace-nowrap">
                {
                  validator && validator?.firstSeen && (
                    <p className="text-text-heading-gray text-base mb-2">
                      Validating Since
                      <span className="ms-1.5 font-semibold">
                        {new Date(
                          parseInt(validator.firstSeen as string) * 1000
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  )
                }
                {
                  validator && validator?.totalValidated && (
                    <p className="text-text-heading-gray text-base md:mt-4 mt-2">
                      Validated Blocks
                      <span className="ms-1.5 font-semibold">
                        {validator.totalValidated}
                      </span>
                    </p>
                  )
                }
              </div>
            </div>
            <div className="grid grid-cols-2 mt-8 gap-4 md:grid-cols-1">
              <InfoCard
                Header={
                  new Intl.NumberFormat().format(
                    parseFloat(validator?.stakeAmount as string)
                  ) + " FUSE"
                }
                Body={
                  "~$ " +
                  new Intl.NumberFormat().format(
                    parseFloat(validator?.stakeAmount as string) *
                    validators.fuseTokenUSDPrice
                  )
                }
                Footer="Staked Amount"
                isLoading={!validator}
                size="large"
              />
              <InfoCard
                size="large"
                Header={new Intl.NumberFormat().format(
                  parseInt(validator?.delegatorsLength as string)
                )}
                Footer="Total Delegators"
                type={2}
                isLoading={!validator}
                icon={expandArrow}
                onClick={() => {
                  setIsOpen(true);
                  const delegatorsFilter = validator?.delegators.map(([delegator]) => delegator) ?? [];
                  dispatch(
                    fetchDelegatedAmounts({
                      address: validator?.address ?? hex,
                      delegators: delegatorsFilter,
                    })
                  );
                }}
              />
              {
                validator?.uptime && (
                  <InfoCard
                    size="large"
                    Header={validator?.uptime + "%"}
                    Body="&nbsp;"
                    Footer="Uptime"
                    type={2}
                    isLoading={!validator}
                  />
                )
              }

              <InfoCard
                size="large"
                Header={validator?.fee + "%"}
                Body="&nbsp;"
                Footer="Fee"
                type={2}
                isLoading={!validator}
              />
            </div>
            <div className="flex mt-6">
              <div className="flex flex-col w-1/2">
                <p className="text-2xl font-bold">State</p>
                {!validator ? (
                  <span className="px-8 mt-4 py-3 me-auto bg-dark-gray rounded-lg animate-pulse" />
                ) : validator?.forDelegation ? (
                  <Pill type="success" text={"Open"} className="me-auto mt-4 px-3 py-2.5" />
                ) : (
                  <Pill type="error" text={"Closed"} className="me-auto mt-4 px-3 py-2.5" />
                )}
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-2xl font-bold">Status</p>
                {!validator ? (
                  <span className="px-8 mt-4 py-3 me-auto bg-dark-gray rounded-lg animate-pulse" />
                ) : validator?.status === "active" ? (
                  <Pill
                    type="success"
                    text={"Active"}
                    className="me-auto mt-4 px-3 py-2.5"
                  />
                ) : (
                  <Pill
                    type="error"
                    text={"Jailed"}
                    className="me-auto mt-4 px-3 py-2.5"
                  />
                )}
              </div>
            </div>
            {validator?.description && (
              <div className="flex flex-col mt-6">
                <p className="font-bold text-2xl">Description</p>
                <p className="text-text-heading-gray mt-4">
                  {validator?.description}
                </p>
              </div>
            )}

            {validator?.website && (
              <div className="flex flex-col my-6">
                <p className="font-bold text-2xl">Links</p>
                <span className="flex mt-4 items-center">
                  <Image src={link} alt="link" className="me-1" height={8} />
                  <a
                    className="text-text-heading-gray me-auto hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    href={validator.website}
                  >
                    {validator.website}
                  </a>
                </span>
              </div>
            )}
          </div>
          <div className="w-[414px] pt-16 md:pt-8 md:pb-6 md:w-full md:ps-0">
            <StickyBox offsetTop={90}>
              <StakeCard
                validator={validator}
                closed={validator?.forDelegation ? false : true}
                warningToggle={() => {
                  setIsWarningAcknowledge(false);
                  setIsWarningOpen(true);
                }}
                handleStake={handleStake}
                handleUnstake={handleUnstake}
                amount={amount}
                setAmount={setAmount}
                isLoading={isLoading}
              />
            </StickyBox>
          </div>
        </div>
        <FAQ
          className="mt-28 mb-16 w-8/9"
          questions={faqs}
          answers={faqAnswers}
        />
      </div>
    </div>
  );
};

export default Stake;