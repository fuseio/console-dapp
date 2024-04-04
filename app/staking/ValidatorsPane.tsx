import React, { useState } from "react";
import ValidatorCard from "./ValidatorCard";
import { ValidatorType } from "@/store/validatorSlice";
import Button from "@/components/ui/Button";
import { eclipseAddress } from "@/lib/helpers";
import coins from "@/assets/coins.svg";
import ChevronDown from "@/assets/ChevronDown";
import ChevronUp from "@/assets/ChevronUp";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import RpcNotice from "@/components/staking/RpcNotice";
import { useBlockNumber } from "wagmi";
import Image from "next/image";

const ValidatorsPane = ({
  validators,
  isLoading,
  filters,
  selected,
  onClick = () => { },
}: {
  validators: ValidatorType[];
  isLoading: boolean;
  filters: string[];
  selected: number;
  onClick?: (index: number) => void;
}) => {
  const [validatorsToDisplay, setValidatorsToDisplay] = useState<
    ValidatorType[]
  >([]);
  const [page, setPage] = useState(1);
  const { failureCount } = useBlockNumber({
    watch: true
  });

  useDeepCompareEffectNoCheck(() => {
    setValidatorsToDisplay(
      validators.slice(
        0,
        page * 12 < validators.length ? page * 12 : validators.length
      )
    );
  }, [validators, page]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex mt-12 md:w-full md:bg-inactive-dark md:rounded-md md:p-1">
        {filters.map((filter, index) => {
          return (
            <p
              className={
                selected === index
                  ? "text-primary font-medium px-8 py-2 bg-selected-light-gray rounded cursor-pointer md:w-1/2 md:bg-white md:text-center md:rounded-md"
                  : "text-primary font-normal px-8 py-2 text-text-gray cursor-pointer md:w-1/2 md:text-center"
              }
              onClick={() => {
                onClick(index);
              }}
              key={index}
            >
              {filter}
            </p>
          );
        })}
      </div>
      <div className="w-full grid grid-cols-4 mt-4 gap-4 md:grid-cols-1 md:gap-y-5">
        {isLoading &&
          Array.from([1, 2, 3, 4, 5, 6]).map((i) => {
            return (
              <ValidatorCard
                name=""
                commission=""
                stakedAmount=""
                state=""
                status=""
                isLoading
                key={i}
                address=""
                firstSeen=""
              />
            );
          })}
        {validatorsToDisplay.map((validator, i) => {
          return (
            <ValidatorCard
              name={
                (validator.name as string).length <= 20
                  ? (validator.name as string)
                  : eclipseAddress(validator.name as string)
              }
              commission={validator.fee + "%"}
              stakedAmount={new Intl.NumberFormat().format(
                parseFloat(validator.stakeAmount)
              )}
              state={validator.forDelegation ? "Open" : "Closed"}
              status={validator.status as string}
              image={validator.image}
              address={validator.address}
              key={i}
              firstSeen={validator.firstSeen as string}
              totalDelegators={validator.delegatorsLength}
              uptime={validator.uptime?.toFixed(2)}
            />
          );
        })}
      </div>
      {validatorsToDisplay.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center mt-28">
          {(!failureCount && selected === 1) &&
            <>
              <Image src={coins} alt="coins" />
              <p className="text-2xl font-black text-fuse-black mt-3 w-1/2 text-center md:w-full">
                No staked validators yet! Begin your staking journey by delegating
                tokens to a validator of your choice.
              </p>
            </>
          }
          {failureCount > 0 && <RpcNotice />}
        </div>
      )}
      <div className="flex w-full justify-center mt-12">
        {validatorsToDisplay.length < validators.length ? (
          <Button
            text="See more"
            className="flex items-center gap-1 border border-fuse-black text-sm/[13.54px] text-black rounded-full font-medium"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            <ChevronDown />
          </Button>
        ) : validatorsToDisplay.length > 12 ? (
          <Button
            text="See less"
            className="flex items-center gap-1 border border-fuse-black text-sm/[13.54px] text-black rounded-full font-medium"
            onClick={() => {
              setPage(1);
            }}
          >
            <ChevronUp />
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ValidatorsPane;
