import React, { useState, useCallback, useMemo, useEffect, memo } from "react";
import Image from "next/image";
import { useAccount, useConfig } from "wagmi";
import { getBalance } from 'wagmi/actions';
import { fuse } from "viem/chains";
import { formatUnits } from "viem";

import { useAppSelector } from "@/store/store";
import { selectMaxStake, selectMinStake, selectValidatorSlice } from "@/store/validatorSlice";
import { ValidatorType } from "@/lib/types";
import { evmDecimals } from "@/lib/helpers";
import { getInflation } from "@/lib/contractInteract";

import Button from "@/components/ui/Button";
import ConnectWallet from "@/components/ConnectWallet";

import fuseToken from "@/assets/fuseToken.svg";
import info from "@/assets/info-black.svg";

type StakeCardProps = {
  validator?: ValidatorType;
  closed?: boolean;
  warningToggle?: () => void;
  handleStake: () => void;
  handleUnstake: () => void;
  amount: string | null;
  setAmount: (amount: string | null) => void;
  isLoading: boolean;
};

const StakeCard: React.FC<StakeCardProps> = ({
  validator,
  closed = false,
  warningToggle = () => { },
  handleStake,
  handleUnstake,
  amount,
  setAmount,
  isLoading,
}) => {
  const [cardMode, setCardMode] = useState(closed ? 1 : 0);
  const [balance, setBalance] = useState("0.0");
  const [inflation, setInflation] = useState(0.03);

  const maxStake = useAppSelector(selectMaxStake);
  const minStake = useAppSelector(selectMinStake);
  const validatorSlice = useAppSelector(selectValidatorSlice);

  const { address, isConnected } = useAccount();
  const config = useConfig();

  useEffect(() => {
    if (closed) {
      setCardMode(1);
    } else {
      setCardMode(0);
    }
  }, [closed]);

  const setMode = useCallback((mode: number) => {
    if (!closed) setCardMode(mode);
  }, [closed]);

  const updateBalance = useCallback(async () => {
    if (address) {
      const balance = await getBalance(config, { address, chainId: fuse.id });
      setBalance(formatUnits(balance?.value ?? BigInt(0), balance?.decimals ?? evmDecimals));
    }
  }, [address, config]);

  useEffect(() => {
    updateBalance();
    getInflation().then(setInflation);
  }, [updateBalance]);

  const getAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount || "0");
    return isNaN(parsedAmount) ? 0 : parsedAmount;
  }, [amount]);

  const getPredictedReward = useCallback((amt: number) => {
    if (!validator) return 0;
    return validatorSlice.fuseTokenTotalSupply * inflation *
      (amt / parseFloat(validatorSlice.totalStakeAmount)) *
      (1 - parseFloat(validator.fee) / 100);
  }, [inflation, validator, validatorSlice.fuseTokenTotalSupply, validatorSlice.totalStakeAmount]);

  const getPredictedIncrease = useMemo(() => {
    if (!validator) return 0;
    return (validatorSlice.fuseTokenTotalSupply / parseFloat(validatorSlice.totalStakeAmount)) *
      inflation * (1 - parseFloat(validator.fee) / 100);
  }, [inflation, validator, validatorSlice.fuseTokenTotalSupply, validatorSlice.totalStakeAmount]);

  const handleWithdraw = useCallback(() => {
    if (!validator) return;
    if (parseFloat(validator.stakeAmount) - getAmount < parseFloat(minStake)) {
      warningToggle();
    } else {
      handleUnstake();
    }
  }, [getAmount, handleUnstake, minStake, validator, warningToggle]);

  const reward = useMemo(() => {
    if (!validator?.selfStakeAmount) return getPredictedReward(getAmount);
    const baseAmount = parseFloat(validator.selfStakeAmount);
    return getPredictedReward(cardMode === 0 ? baseAmount + getAmount : baseAmount - getAmount);
  }, [cardMode, getAmount, getPredictedReward, validator]);

  const isMaxStakeReached = useMemo(() => {
    if (!validator) return false;
    return cardMode === 0 &&
      parseFloat(validator.stakeAmount) + getAmount > parseFloat(maxStake);
  }, [cardMode, getAmount, maxStake, validator]);

  const buttonText = useMemo(() => {
    if (isLoading) return "Loading...";
    if (isMaxStakeReached) return "Maximum Stake Reached";
    return cardMode === 0 ? "Stake" : "Unstake";
  }, [cardMode, isLoading, isMaxStakeReached]);

  return (
    <div className="w-full bg-white rounded-xl p-6 flex flex-col">
      {/* Mode selection */}
      <div className="flex w-full bg-modal-bg rounded-md p-[2px]">
        {["Stake", "Unstake"].map((mode, index) => (
          <p
            key={mode}
            className={`text-primary font-${cardMode === index ? 'semibold' : 'medium'} py-2 ${cardMode === index ? 'rounded-md bg-white' : ''} cursor-pointer w-1/2 text-center text-sm`}
            onClick={() => {
              setMode(index);
              setAmount(null);
            }}
          >
            {mode}
          </p>
        ))}
      </div>

      {/* Balance display */}
      {cardMode === 0 && (
        <div className="flex w-full justify-end mt-6">
          <p className="text-xs text-text-gray">
            Available Balance: {isConnected ? new Intl.NumberFormat().format(parseFloat(balance)) : "0"} Fuse
          </p>
        </div>
      )}

      {/* Amount input */}
      <div className="flex w-full">
        <div className="w-full bg-bg-dark-gray rounded-lg flex py-[9px] ps-2 pe-4 mt-2 items-center">
        <div className="w-1/12">
            <Image src={fuseToken} alt="Fuse" />
          </div>
          <input
            className="bg-bg-dark-gray ms-2 outline-none h-full w-9/12"
            placeholder="0.0"
            value={amount ?? ""}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            text="Max"
            className="bg-black font-medium text-sm text-white rounded-[4px] w-2/12"
            padding="px-[8px] py-[6px]"
            onClick={() => {
              if (cardMode === 0) {
                if (parseFloat(balance) < 0.1) return;
                setAmount((parseFloat(balance) - 0.1).toString());
              } else {
                setAmount(validator?.selfStakeAmount as string);
              }
            }}
          />
        </div>
      </div>

      {/* Stake information */}
      {[
        { label: "Current Stake", value: validator?.selfStakeAmount },
        { label: cardMode === 0 ? "Added Stake" : "Removed Stake", value: getAmount.toString() },
        {
          label: "Total", value: validator ? (cardMode === 0 ?
            (parseFloat(validator.selfStakeAmount || "0") + getAmount).toString() :
            (parseFloat(validator.selfStakeAmount || "0") - getAmount).toString()) : undefined
        }
      ].map(({ label, value }, index) => (
        <React.Fragment key={label}>
          {index === 2 && <hr className="w-full h-[0.5px] border-[#D1D1D1] my-3" />}
          <div className="flex justify-between mt-2">
            <p className="text-sm font-semibold text-text-gray">{label}</p>
            {value !== undefined ? (
              <p className="text-sm font-semibold text-[#071927]">
                {new Intl.NumberFormat().format(parseFloat(value))} FUSE
              </p>
            ) : (
              <span className="ms-2 px-11 py-1 bg-dark-gray rounded-lg animate-pulse" />
            )}
          </div>
        </React.Fragment>
      ))}

      {/* Projected rewards */}
      <div className="flex justify-between mt-2">
        <div className="flex relative">
          <p className="text-sm font-semibold text-text-gray">
            Projected<br className="hidden md:block" /> Rewards (1y)
          </p>
          <Image
            src={info}
            alt="info"
            className="peer mb-1 ms-1 cursor-pointer"
          />
          <div className="hidden absolute top-5 left-0 rounded-lg bg-white shadow-xl w-80 py-3 px-4 md:w-full peer-hover:block text-sm z-50">
            The rewards displayed are estimates. Actual rewards depend on the
            total locked supply in the network at each checkpoint, which may
            vary as more FUSE tokens are staked.
          </div>
        </div>

        {validator ? (
          <p className="text-sm font-semibold text-[#071927] text-right">
            {new Intl.NumberFormat().format(reward)} FUSE
            <br className="hidden md:block" />
            <span className="text-[#66E070]">
              {" (+"}
              {(getPredictedIncrease * 100).toFixed(1)}
              {"%)"}
            </span>
          </p>
        ) : (
          <span className="ms-2 px-11 py-1 bg-dark-gray rounded-lg animate-pulse" />
        )}
      </div>

      {/* Action button */}
      {isConnected ? (
        <Button
          text={buttonText}
          className="bg-black font-medium text-white mt-6 rounded-full"
          disabledClassName="bg-black/25 font-medium text-white rounded-full w-full mt-6"
          disabled={getAmount === 0 || isLoading || isMaxStakeReached}
          onClick={() => {
            if (!isConnected || !validator || getAmount === 0) return;
            const handleAction = () => cardMode === 0 ? handleStake() : handleWithdraw();
            handleAction();
          }}
        />
      ) : (
        <ConnectWallet className="mt-6" />
      )}
    </div>
  );
};

export default memo(StakeCard);