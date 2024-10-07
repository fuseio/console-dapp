import React, { useCallback, useMemo } from "react";
import Pill from "@/components/staking/Pill";
import { useRouter } from 'next/navigation'
import Jazzicon from "react-jazzicon";
import Image from "next/image";

type ValidatorCardProps = {
  className?: string;
  name: string | undefined;
  stakedAmount: string;
  status: string | undefined;
  state: string;
  commission: string;
  isLoading?: boolean;
  image?: string;
  address: string;
  firstSeen: string | undefined;
  totalDelegators?: string;
  uptime?: string;
};

const ValidatorCard: React.FC<ValidatorCardProps> = ({
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
}) => {
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (!isLoading) {
      router.push(`/stake/${address.toLowerCase()}`);
    }
  }, [isLoading, address, router])

  const validatorImage = useMemo(() => (
    image ? (
      <Image
        src={`/${image}`}
        alt="validator"
        width={64}
        height={64}
        className="rounded-lg h-16 w-16"
      />
    ) : (
      <Jazzicon diameter={64} seed={name ? parseInt(name, 16) : 0} />
    )
  ), [image, name]);

  const renderInfoRow = (label: string, value: string | undefined) => (
    <div className="flex justify-between pt-4">
      <p className="text-sm font-normal text-text-gray">{label}</p>
      {isLoading ? (
        <span className="px-5 bg-dark-gray rounded-md animate-pulse"></span>
      ) : (
        <p className="text-sm font-normal text-tertiary-gray">{value}</p>
      )}
    </div>
  );

  return (
    <div
      className={`bg-white rounded-xl flex flex-col justify-between p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {isLoading ? (
          <div className="h-16 w-16 rounded-lg bg-dark-gray animate-pulse"></div>
        ) : (
          <div className="h-16 w-16">{validatorImage}</div>
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
              `Validating Since ${new Date(parseInt(firstSeen) * 1000).toLocaleDateString()}`
            ) : (
              ""
            )}
          </p>
        </div>
      </div>
      {renderInfoRow("Staked", stakedAmount)}
      {renderInfoRow("Total Delegators", totalDelegators)}
      {renderInfoRow("Uptime", uptime ? `${uptime}%` : undefined)}
      {renderInfoRow("Commission", commission)}
      <div className="flex justify-start pt-4">
        <Pill 
          type={state === "Open" ? "success" : "inactive"} 
          text={state} 
          isLoading={isLoading} 
        />
        <Pill
          type={status === "active" ? "success" : "error"}
          text={status === "active" ? "Active" : "Jailed"}
          isLoading={isLoading}
          className="ms-3"
        />
      </div>
    </div>
  );
};

export default ValidatorCard;
