import React, { useCallback, useEffect, useMemo } from "react";
import piggybank from "@/assets/piggybank.svg";
import FAQ from "@/components/FAQ";
import FilterBar from "@/components/staking/FilterBar";
import InfoCard from "@/components/staking/InfoCard";
import SearchBar from "@/components/staking/SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchSelfStake,
  fetchValidators,
  selectValidatorSlice,
} from "@/store/validatorSlice";
import {
  selectSearchSlice,
  setReduxSearch,
  setReduxStateFilter,
  setReduxStatusFilter,
  setReduxMyStakeFilter,
  setReduxSort
} from "@/store/searchSlice";
import ValidatorsPane from "./ValidatorsPane";
import SortBar from "@/components/staking/SortBar";
import { useAccount } from "wagmi";
import { hex } from "@/lib/helpers";
import Image from "next/image";
import useDeepCompareEffect from "use-deep-compare-effect";

const Home = () => {
  const validatorSlice = useAppSelector(selectValidatorSlice);
  const searchSlice = useAppSelector(selectSearchSlice);
  const { address } = useAccount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchValidators());
  }, [dispatch]);

  useDeepCompareEffect(() => {
    if (validatorSlice.validatorMetadata.length > 0) {
      dispatch(
        fetchSelfStake({
          address: address || hex,
          validators: validatorSlice.validators,
        })
      );
    }
  }, [address, validatorSlice.validatorMetadata.length, dispatch]);

  const setSearch = useCallback((search: string) => {
    dispatch(setReduxSearch(search));
  }, [dispatch]);

  const setStateFilter = useCallback((stateFilter: number) => {
    dispatch(setReduxStateFilter(stateFilter));
  }, [dispatch]);

  const setStatusFilter = useCallback((statusFilter: number) => {
    dispatch(setReduxStatusFilter(statusFilter));
  }, [dispatch]);

  const setMyStakeFilter = useCallback((myStakeFilter: number) => {
    dispatch(setReduxMyStakeFilter(myStakeFilter));
  }, [dispatch]);

  const setSort = useCallback((sort: number) => {
    dispatch(setReduxSort(sort));
  }, [dispatch]);

  const filteredValidators = useMemo(() => {
    if (validatorSlice.validatorMetadata.length === 0) return [];

    return validatorSlice.validatorMetadata
      .filter((validator) => {
        const { search, stateFilter, statusFilter, myStakeFilter } = searchSlice;
        return (
          (validator.name?.toLowerCase().includes(search.toLowerCase()) ||
            validator.address?.toLowerCase().includes(search.toLowerCase())) &&
          (stateFilter === 0 ||
            (stateFilter === 1 && validator.forDelegation) ||
            (stateFilter === 2 && !validator.forDelegation)) &&
          (statusFilter === 0 ||
            (statusFilter === 1 && validator.status === "active") ||
            (statusFilter === 2 && validator.status === "inactive")) &&
          (myStakeFilter === 0 ||
            (myStakeFilter === 1 &&
              validator?.selfStakeAmount &&
              parseFloat(validator.selfStakeAmount) > 0))
        );
      })
      .sort((a, b) => {
        switch (searchSlice.sort) {
          case 0:
            return parseFloat(b.stakeAmount) - parseFloat(a.stakeAmount);
          case 1:
            return parseFloat(b.delegatorsLength) - parseFloat(a.delegatorsLength);
          case 2:
            return (b.uptime ?? 0) - (a.uptime ?? 0) || parseFloat(b.stakeAmount) - parseFloat(a.stakeAmount);
          case 3:
            return (parseInt(a.firstSeen ?? '0') - parseInt(b.firstSeen ?? '0'));
          default:
            return 0;
        }
      });
  }, [validatorSlice.validatorMetadata, searchSlice]);

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
      <div className="w-8/9 flex flex-col mt-16 md:w-9/10 max-w-7xl">
        <div className="flex w-fit items-start">
          <div className="flex flex-col w-6/12 md:w-full">
            <h1 className="font-semibold text-5xl text-fuse-black leading-none md:text-4xl">
              Staking
            </h1>
            <span className="text-base font-normal mt-4 text-text-heading-gray">
              The Fuse Staking Dapp enables users to participate in the Fuse
              network&apos;s consensus by staking FUSE tokens. Through a
              user-friendly interface, validators and delegators can manage
              their stakes, monitor rewards, and contribute to network security.
              Explore the Dapp to maximize your staking experience on the Fuse
              network.
            </span>
          </div>
          <div className="w-7/12 flex justify-end md:hidden">
            <Image src={piggybank} alt="piggybank" />
          </div>
        </div>
        <div className="grid grid-cols-4 mt-0 gap-x-4 justify-between md:mt-12 md:grid-cols-1 md:gap-y-3 md:gap-x-3">
          <InfoCard
            Header={
              new Intl.NumberFormat().format(
                parseFloat(
                  parseFloat(validatorSlice.totalStakeAmount).toFixed(1)
                )
              ) + " FUSE"
            }
            Body={
              "~$ " +
              new Intl.NumberFormat().format(
                parseFloat(validatorSlice.totalStakeAmount) *
                validatorSlice.fuseTokenUSDPrice
              )
            }
            Footer="Total Fuse Staked"
            classname="mr-4"
            key={1}
            isLoading={validatorSlice.isLoading}
            size="large"
          />
          <InfoCard
            Header={
              new Intl.NumberFormat().format(
                parseFloat(validatorSlice.myStakeAmount)
              ) + " FUSE"
            }
            Body={
              "~$ " +
              new Intl.NumberFormat().format(
                parseFloat(validatorSlice.myStakeAmount) *
                validatorSlice.fuseTokenUSDPrice
              )
            }
            Footer="My Total Stake"
            classname="mr-4"
            key={2}
            isLoading={validatorSlice.isBalanceLoading}
            size="large"
          />
          <InfoCard
            Header={validatorSlice.validators.length.toString()}
            Footer="Total Validators"
            type={2}
            classname="mr-4"
            key={3}
            isLoading={validatorSlice.isLoading}
            size="large"
          />
          <InfoCard
            Header={new Intl.NumberFormat().format(
              validatorSlice.totalDelegators
            )}
            Footer="Total Delegators"
            type={2}
            key={4}
            isLoading={validatorSlice.isLoading}
            size="large"
          />
        </div>
        <div className="flex flex-col gap-6 mt-16">
          <p className="text-2xl text-black font-semibold">
            Validators
          </p>
          <div className="flex gap-6 justify-between items-center xl:flex-col xl:justify-start xl:items-start">
            <div className="flex gap-3 md:gap-4 w-full md:flex-col md:justify-start md:items-start">
              <SearchBar
                className="w-[180px] md:w-full"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={searchSlice.search}
              />
              <SortBar
                className="w-[180px] md:w-full md:mt-4"
                options={[
                  "Highest Stake",
                  "Highest Delegators",
                  "Highest Uptime",
                  "Earliest Validation Start Date",
                ]}
                selected={searchSlice.sort}
                onChange={setSort}
              />
            </div>
            <div className="flex gap-12 md:gap-4 w-full md:flex-col md:justify-start md:items-start">
              <FilterBar
                className="w-[324px] md:w-full md:pe-0"
                name="State"
                states={["All", "Open", "Closed"]}
                background={["#DDF5FF", "#E0FFDD", "#EBEBEB"]}
                text={["#003D75", "#success-dark", "#000000"]}
                onClick={setStateFilter}
                select={searchSlice.stateFilter}
                tooltip={`Validators can be "open" or "closed" for delegation. You can only delegate tokens to open validators. If a validator you've delegated to becomes closed, you can still unstake your tokens anytime.`}
              />
              <FilterBar
                className="w-[332px] md:w-full"
                name="Status"
                states={["All", "Active", "Inactive"]}
                background={["#DDF5FF", "#E0FFDD", "#FFDDDD"]}
                text={["#003D75", "#success-dark", "#750000"]}
                onClick={setStatusFilter}
                select={searchSlice.statusFilter}
                tooltip={`Validators can be "active" or "inactive". Active validators are currently validating blocks, while inactive validators are not, due to maintenance or being jailed.`}
              />
            </div>
          </div>
        </div>
        <ValidatorsPane
          isLoading={validatorSlice.validatorMetadata.length === 0 && validatorSlice.isLoading}
          validators={filteredValidators}
          filters={["All", "My Staked"]}
          selected={searchSlice.myStakeFilter}
          onClick={setMyStakeFilter}
        />
        <FAQ className="mt-[106px] mb-16" questions={faqs} answers={faqAnswers} />
      </div>
    </div>
  );
};

export default Home;