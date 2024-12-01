import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { generateAirdropTwitterAuthUrl, selectAirdropSlice, setIsQuestModalOpen, verifyAirdropQuest } from "@/store/airdropSlice";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import close from "@/assets/close.svg";
import Spinner from "../ui/Spinner";
import Markdown from "react-markdown";
import fire from "@/assets/fire.svg";

type QuestDescriptions = {
  [key: string]: React.ReactNode;
}

const questDescriptions: QuestDescriptions = {}

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
            className="bg-white bg-linear-gradient-orange h-fit max-h-[98%] overflow-y-auto w-[519px] xl:w-[415px] max-w-[95%] z-[80] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
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
                <div className="text-lg xl:text-base leading-6 text-pale-slate font-medium max-w-md xl:max-w-xs mt-5 whitespace-pre-wrap">
                  {
                    questDescriptions[selectedQuest.id] ??
                    <Markdown>{selectedQuest.description}</Markdown>
                  }
                </div>
                <div className="flex items-end self-start gap-2 text-left mt-12 ml-8 max-w-md xl:max-w-xs">
                  <Image
                    src={fire}
                    alt="fire"
                    width={22}
                    height={28}
                  />
                  <p className="text-2xl xl:text-lg leading-none font-bold">
                    {selectedQuest.point} Points
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
