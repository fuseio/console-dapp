import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { generateAirdropTwitterAuthUrl, selectAirdropSlice, setIsQuestModalOpen, verifyAirdropQuest } from "@/store/airdropSlice";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import close from "@/assets/close.svg";
import Spinner from "../ui/Spinner";
import Markdown from "react-markdown";
import pointHexagon from "@/assets/fuse-foundation-point-hexagon.svg";

type QuestDescriptions = {
  [key: string]: React.ReactNode;
}

const BridgeDescription = () => {
  return (
    <div className="flex flex-col gap-[30px]">
      <p>
        Get 4 points daily for each $1 bridged to Fuse
      </p>
      <div className="flex flex-col gap-2.5">
        <p className="font-bold">Quest conditions:</p>
        <ul className="list-disc max-w-[378px] text-left">
          <li>Bridge FUSE, USDC, UDST or ETH token</li>
          <li>{"Points begin accumulating after >24 hours pass from the bridging transaction"}</li>
          <li>Do not swap or stake bridged assets on Console dApp</li>
        </ul>
      </div>
    </div>
  )
}

const LiquidityVoltageDescription = () => {
  return (
    <div className="flex flex-col gap-6">
      <p>
        Earn up to 8 points per each $1 provided to liquidity pool every day!
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to earn 4 point per $1?</p>
        <ul className="list-disc pl-5 md:pl-3 text-left">
          <li>Put your funds on Fuse Network to any liquidity pool on Voltage right now to earn 4 point on each $1 in the pool daily.</li>
          <li>If you already have funds in a pool - just keep it!</li>
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to multiply points?</p>
        <p>Use bridged to Fuse Network funds to get 8 points on each $1 in the pool every day.</p>
      </div>
    </div>
  )
}

const StakeOnVoltageDescription = () => {
  return (
    <div className="flex flex-col gap-6">
      <p>
        Earn up to 8 points per each $1 staked every day!
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to earn 4 point per $1?</p>
        <ul className="list-disc pl-5 md:pl-3 text-left">
          <li>Stake FUSE, VOLT, USDC or WETH on Voltage right now to earn 4 point on each $1 staked daily.</li>
          <li>If you already have staked funds - just keep it!</li>
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to multiply points?</p>
        <p>Use bridged to Fuse Network funds to get 8 points on each $1 staked every day.</p>
      </div>
    </div>
  )
}

const ProvideMeridianLiquidityDescription = () => {
  return (
    <div className="flex flex-col gap-6">
      <p>
        Earn up to 8 points per each $1 lent on Meridian Finance!
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to earn 4 point per $1?</p>
        <ul className="list-disc pl-5 md:pl-3 text-left">
          <li>Go to Meridian Finance and lend your funds in any market.</li>
          <li>If you already have lent funds - just keep it!</li>
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold">How to multiply points?</p>
        <p>Use bridged to Fuse Network funds to get 8 points on each $1 lent every day.</p>
      </div>
    </div>
  )
}

const questDescriptions: QuestDescriptions = {
  "bridge": <BridgeDescription />,
  "liquidityVoltage": <LiquidityVoltageDescription />,
  "stakeOnVoltage": <StakeOnVoltageDescription />,
  "provideMeridianLiquidity": <ProvideMeridianLiquidityDescription />
}

const QuestModal = (): JSX.Element => {
  const { isQuestModalOpen, selectedQuest } = useAppSelector(selectAirdropSlice);
  const dispatch = useAppDispatch();

  function handleClick(id: string, endpoint?: string) {
    if (endpoint) {
      return dispatch(verifyAirdropQuest({ endpoint }));
    }

    switch (id) {
      case "followFuseOnTwitter":
        dispatch(generateAirdropTwitterAuthUrl());
        break;
      default:
        dispatch(verifyAirdropQuest({}));
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "quest-modal-bg") {
        dispatch(setIsQuestModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {isQuestModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-[80] flex backdrop-blur"
          id="quest-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white bg-linear-gradient-green h-fit max-h-[98%] overflow-y-auto w-[519px] xl:w-[415px] max-w-[95%] z-[80] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <div className="absolute top-5 right-9 xl:right-7 z-10">
              <Image
                src={close}
                alt="close"
                width={40}
                height={40}
                className="cursor-pointer hover:opacity-60"
                onClick={() => dispatch(setIsQuestModalOpen(false))}
              />
            </div>
            <div className="relative flex flex-col justify-between min-h-[inherit] mt-12 xl:mt-7">
              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center items-center">
                  <Image
                    src={selectedQuest.image}
                    alt={selectedQuest.title}
                    className="pt-2.5"
                  />
                </div>
                <p className="text-2xl xl:text-xl leading-none font-bold mt-8 max-w-md xl:max-w-xs">
                  {selectedQuest.title}
                </p>
                <div className="text-lg xl:text-base leading-6 text-fuse-black font-medium max-w-md xl:max-w-xs mt-5 whitespace-pre-wrap">
                  {
                    questDescriptions[selectedQuest.id] ??
                    <Markdown>{selectedQuest.description}</Markdown>
                  }
                </div>
                <div className="flex items-end self-start gap-2 text-left mt-12 ml-8 max-w-md xl:max-w-xs">
                  <Image
                    src={pointHexagon}
                    alt="point hexagon"
                    width={22}
                    height={28}
                  />
                  <p className="text-2xl xl:text-lg leading-none font-bold">
                    {selectedQuest.point}
                  </p>
                </div>
              </div>
              <div className="min-h-[104px] xl:min-h-fit mt-10">
                <hr className="border-[0.3px] border-davy-gray" />
                <div className="flex items-center gap-2 mt-7 mb-8 xl:mt-6 xl:mb-6.5 px-9 xl:px-7">
                  {selectedQuest.buttons?.map((button, index) => (
                    <button
                      key={index}
                      className="transition ease-in-out bg-black flex justify-center items-center gap-2 border border-black rounded-full text-white leading-none font-semibold px-9 py-4 xl:px-7 xl:py-2.5 hover:bg-white hover:text-black"
                      onClick={() => {
                        if (button.isFunction) {
                          handleClick(selectedQuest.id, button.endpoint);
                        }
                        if (button.link) {
                          window.open(button.link, "_blank")
                        }
                      }}
                    >
                      {button.text}
                      {button.isLoading &&
                        <Spinner />
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default QuestModal;
