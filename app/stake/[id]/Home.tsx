import React, { useEffect, useState } from "react";
import copy from "@/assets/copy.svg";
import InfoCard from "@/components/staking/InfoCard";
import Pill from "@/components/staking/Pill";
import StakeCard from "../../staking/StakeCard";
import StickyBox from "react-sticky-box";
import { useAppDispatch, useAppSelector } from "@/store/store";
import link from "@/assets/link.svg";
import arrow from "@/assets/arrow.svg";
import ReactGA from "react-ga4";
import ym from "react-yandex-metrika";
import {
  ValidatorType,
  fetchDelegatedAmounts,
  fetchSelfStake,
  fetchValidatorMetadata,
  fetchValidators,
  selectValidatorSlice,
} from "@/store/validatorSlice";
import { eclipseAddress, hex } from "@/lib/helpers";
import Jazzicon from "react-jazzicon";
import Modal from "@/components/staking/Modal";
import FAQ from "@/components/staking/FAQ";
import WarningModal from "@/components/staking/WarningModal";
import { delegate, withdraw } from "@/lib/contractInteract";
import { Address, useAccount } from "wagmi";
import * as amplitude from "@amplitude/analytics-browser";

const Stake = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [validator, setValidator] = useState<ValidatorType | undefined>(
    undefined
  );
  const [amount, setAmount] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const validators = useAppSelector(selectValidatorSlice);
  const [isOpen, setIsOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isWarningAknowledged, setIsWarningAknowledged] = useState(false);
  const { address } = useAccount();

  const getAmount = () => {
    if (isNaN(parseFloat(amount as string))) return 0;
    return parseFloat(amount as string);
  };
  const handleStake = () => {
    setIsLoading(true);
    delegate(getAmount().toString(), validator?.address ?? hex)
      .then(() => {
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
      .then(() => {
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
        });
        setAmount(null);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (validators.validatorMetadata.length > 0) {
      setValidator(
        validators.validatorMetadata.filter(
          (v) => v.address.toLowerCase() === id?.toLowerCase()
        )[0]
      );
    } else {
      dispatch(fetchValidators());
    }
  }, [id, validators.validatorMetadata.length]);

  useEffect(() => {
    if (
      validators.validators.length > 0 &&
      validators.validatorMetadata.length === 0
    ) {
      dispatch(fetchValidatorMetadata(validators.validators));
    }
  }, [validators.validators]);

  useEffect(() => {
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
        href="https://docs.fuse.io/docs/validators/how-to-become-a-validator/"
        className="underline"
      >
        https://docs.fuse.io/docs/validators/how-to-become-a-validator/
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
        href="https://docs.fuse.io/docs/validators/participating-in-network-consensus/stake-delegate-and-withdraw"
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
        isAknoledged={isWarningAknowledged}
        onConfirm={(arg) => {
          setIsWarningAknowledged(arg);
          if (arg) handleUnstake();
        }}
        minStake={validators.minStakeAmount}
      />
      <div className="flex w-8/9 flex-col md:w-9/10 max-w-7xl">
        <div className="flex w-full md:flex-col">
          <div className="w-[65%] flex flex-col md:w-full">
            <div className="flex mt-14 items-start justify-start md:flex-col">
              <div className="w-2/3 flex justify-start h-20 md:w-full">
                <div className="h-20">
                  {!validator ? (
                    <div className="h-20 w-20 rounded-md bg-dark-gray animate-pulse"></div>
                  ) : validator.image ? (
                    <img
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
                      {validator.name}
                    </p>
                  ) : (
                    <p className="px-28 py-5 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                  {validator ? (
                    <span className="text-text-dark-gray text-base flex">
                      {eclipseAddress(id as string)}
                      <img
                        src={copy.src}
                        alt="Copy"
                        className="ms-2 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(validator.address);
                        }}
                      />
                    </span>
                  ) : (
                    <span className="px-14 py-3 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center w-1/3 h-full ms-6 md:w-full md:items-start md:ms-0 md:mt-8">
                <p className="text-text-heading-gray text-base mb-2">
                  Validating Since
                  {validator ? (
                    <span className="ms-1.5 font-semibold">
                      {new Date(
                        parseInt(validator.firstSeen as string) * 1000
                      ).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="ms-2 px-14 py-1 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                </p>
                <p className="text-text-heading-gray text-base md:mt-4 mt-2">
                  Validated Blocks
                  {validator ? (
                    <span className="ms-1.5 font-semibold">
                      {validator.totalValidated}
                    </span>
                  ) : (
                    <span className="ms-2 px-7 py-1 bg-dark-gray rounded-lg animate-pulse" />
                  )}
                </p>
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
                icon={arrow.src}
                onClick={() => {
                  setIsOpen(true);
                  let delegatorsFilter: Address[] = [];
                  validator?.delegators.forEach((delegator) => {
                    delegatorsFilter.push(delegator[0]);
                  });
                  dispatch(
                    fetchDelegatedAmounts({
                      address: validator?.address ?? hex,
                      delegators: delegatorsFilter,
                    })
                  );
                }}
              />
              <InfoCard
                size="large"
                Header={validator?.uptime + "%"}
                Body="&nbsp;"
                Footer="Uptime"
                type={2}
                isLoading={!validator}
              />
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
                    text={"Inactive"}
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
                  <img src={link.src} alt="link" className="me-1" height={8} />
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
          <div className="w-[35%] ps-16 pt-14 md:pt-8 md:pb-6 md:w-full md:ps-0">
            <StickyBox offsetTop={90}>
              <StakeCard
                validator={validator}
                closed={validator?.forDelegation ? false : true}
                isWarningAknowledged={isWarningAknowledged}
                warningToggle={() => {
                  setIsWarningAknowledged(false);
                  setIsWarningOpen(true);
                }}
                handleStake={handleStake}
                handleUnstake={handleUnstake}
                amount={amount}
                setAmount={setAmount}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
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
