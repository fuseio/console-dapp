import React, { useCallback } from "react";
import Pill from "@/components/staking/Pill";
import { useRouter } from 'next/navigation'
import Jazzicon from "react-jazzicon";
import Image from "next/image";

type ValidatorCardProps = {
  className?: string;
  name: string;
  stakedAmount: string;
  status: string;
  state: string;
  commission: string;
  isLoading?: boolean;
  image?: string;
  address: string;
  firstSeen: string;
  totalDelegators?: string;
  uptime?: string;
};

const ValidatorCard = ({
  name,
  stakedAmount,
  state,
  status,
  className = "",
  commission,
  isLoading = false,
  image = "",
  address,
  firstSeen,
  totalDelegators,
  uptime,
}: ValidatorCardProps) => {
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (isLoading) return;
    router.push(`/stake/${address.toLowerCase()}`);
  }, [isLoading, address, router])

  return (
    <div
      className={
        "bg-white rounded-xl flex flex-col justify-between p-4 hover:shadow-lg transition-all duration-300 cursor-pointer  " +
        className
      }
      onClick={handleClick}
    >
      <div className="flex items-center">
        {isLoading ? (
          <div className="h-16 w-16 rounded-lg bg-dark-gray animate-pulse"></div>
        ) : (
          <div className="h-16 w-16">
            {image ? (
              <Image
                src={`/${image}`}
                alt="validator"
                width={64}
                height={64}
                className="rounded-lg h-16 w-16"
              />
            ) : (
              <Jazzicon diameter={64} seed={parseInt(name, 16)} />
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 ms-3">
          <span className="text-black font-bold text-base/[22.4px]">
            {isLoading ? (
              <span className="px-12 py-[1px] bg-dark-gray rounded-md animate-pulse"></span>
            ) : (
              name
            )}
          </span>
          <p className="font-normal text-sm text-text-gray">
            {isLoading ? (
              <span className="px-16 py-[1px] bg-dark-gray rounded-md animate-pulse"></span>
            ) : firstSeen ? (
              `Validating Since ${new Date(
                parseInt(firstSeen as string) * 1000
              ).toLocaleDateString()}`
            ) : (
              ""
            )}
          </p>
        </div>
      </div>
      <div className="flex justify-between pt-3">
        <p className="text-sm font-normal text-text-gray">Staked</p>
        {isLoading ? (
          <span className="px-14 bg-dark-gray rounded-md animate-pulse"></span>
        ) : (
          <p className="text-sm font-normal text-tertiary-gray">
            {stakedAmount}
          </p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <p className="text-sm font-normal text-text-gray">Total Delegators</p>
        {isLoading ? (
          <span className="px-5 bg-dark-gray rounded-md animate-pulse"></span>
        ) : (
          <p className="text-sm font-normal text-tertiary-gray">
            {totalDelegators}
          </p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <p className="text-sm font-normal text-text-gray">Uptime</p>
        {isLoading ? (
          <span className="px-5 bg-dark-gray rounded-md animate-pulse"></span>
        ) : (
          <p className="text-sm font-normal text-tertiary-gray">{uptime}%</p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <p className="text-sm font-normal text-text-gray">Commission</p>
        {isLoading ? (
          <span className="px-5 bg-dark-gray rounded-md animate-pulse"></span>
        ) : (
          <p className="text-sm font-normal text-tertiary-gray">
            {commission}
          </p>
        )}
      </div>
      <div className="flex justify-start pt-4">
        {state === "Open" ? (
          <Pill type="success" text={state} isLoading={isLoading} />
        ) : (
          <Pill type="inactive" text={state} isLoading={isLoading} />
        )}
        {status === "active" ? (
          <Pill
            type="success"
            text="Active"
            isLoading={isLoading}
            className="ms-3"
          />
        ) : (
          <Pill
            type="error"
            text="Jailed"
            isLoading={isLoading}
            className="ms-3"
          />
        )}
      </div>
    </div>
  );
};

export default ValidatorCard;
