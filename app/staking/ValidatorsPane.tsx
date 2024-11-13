import React, { useState, useMemo } from "react";
import ValidatorCard from "./ValidatorCard";
import Button from "@/components/ui/Button";
import { eclipseAddress } from "@/lib/helpers";
import coins from "@/assets/coins.svg";
import ChevronDown from "@/assets/ChevronDown";
import ChevronUp from "@/assets/ChevronUp";
import RpcNotice from "@/components/staking/RpcNotice";
import { useBlockNumber } from "wagmi";
import Image from "next/image";
import { ValidatorType } from "@/lib/types";

const VALIDATORS_PER_PAGE = 12;

const ValidatorsPane = ({
  validators,
  isLoading,
  filters,
  selected,
  onClick = () => {},
}: {
  validators: ValidatorType[];
  isLoading: boolean;
  filters: string[];
  selected: number;
  onClick?: (index: number) => void;
}) => {
  const [page, setPage] = useState(1);
  const { failureCount } = useBlockNumber({ watch: true });

  const validatorsToDisplay = useMemo(() => 
    validators.slice(0, page * VALIDATORS_PER_PAGE),
  [validators, page]);

  const renderValidatorCard = (validator: ValidatorType, index: number) => (
    <ValidatorCard
      key={index}
      name={validator?.name?.length <= 20 ? validator.name : eclipseAddress(validator.name)}
      commission={`${validator.fee}%`}
      stakedAmount={new Intl.NumberFormat().format(parseFloat(validator.stakeAmount))}
      state={validator.forDelegation ? "Open" : "Closed"}
      status={validator.status}
      image={validator.image}
      address={validator.address}
      firstSeen={validator.firstSeen}
      totalDelegators={validator.delegatorsLength}
      uptime={validator.uptime?.toFixed(2)}
    />
  );

  const renderLoadingCards = () => 
    Array.from({ length: 6 }, (_, i) => (
      <ValidatorCard
        key={i}
        name=""
        commission=""
        stakedAmount=""
        state=""
        status=""
        isLoading
        address=""
        firstSeen=""
      />
    ));

  const renderEmptyState = () => (
    <div className="flex flex-col w-full items-center justify-center mt-28">
      {!failureCount && selected === 1 && (
        <>
          <Image src={coins} alt="coins" />
          <p className="text-2xl font-black text-fuse-black mt-3 w-1/2 text-center md:w-full">
            No staked validators yet! Begin your staking journey by delegating
            tokens to a validator of your choice.
          </p>
        </>
      )}
      {failureCount > 0 && <RpcNotice />}
    </div>
  );

  const renderPaginationButton = () => {
    if (validatorsToDisplay.length < validators.length) {
      return (
        <Button
          text="See more"
          className="flex items-center gap-1 border border-fuse-black text-sm/[13.54px] text-black rounded-full font-medium"
          onClick={() => setPage(page + 1)}
        >
          <ChevronDown />
        </Button>
      );
    } else if (validatorsToDisplay.length > VALIDATORS_PER_PAGE) {
      return (
        <Button
          text="See less"
          className="flex items-center gap-1 border border-fuse-black text-sm/[13.54px] text-black rounded-full font-medium"
          onClick={() => setPage(1)}
        >
          <ChevronUp />
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex mt-12 md:w-full md:bg-inactive-dark md:rounded-md md:p-1">
        {filters.map((filter, index) => (
          <p
            key={index}
            className={`text-primary font-${selected === index ? 'medium' : 'normal'} px-8 py-2 ${
              selected === index ? 'bg-selected-light-gray rounded md:bg-white' : 'text-text-gray'
            } cursor-pointer md:w-1/2 md:text-center ${selected === index ? 'md:rounded-md' : ''}`}
            onClick={() => onClick(index)}
          >
            {filter}
          </p>
        ))}
      </div>
      <div className="w-full grid grid-cols-4 mt-4 gap-4 xl:grid-cols-3 md:grid-cols-1 md:gap-y-5">
        {isLoading ? renderLoadingCards() : validatorsToDisplay.map(renderValidatorCard)}
      </div>
      {validatorsToDisplay.length === 0 && renderEmptyState()}
      <div className="flex w-full justify-center mt-12">
        {renderPaginationButton()}
      </div>
    </div>
  );
};

export default ValidatorsPane;
