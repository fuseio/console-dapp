import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNodesSlice, setIsNoCapacityModalOpen } from "@/store/nodesSlice";

const NoCapacityModal = (): JSX.Element => {
  const nodesSlice = useAppSelector(selectNodesSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "no-capacity-modal-bg") {
        dispatch(setIsNoCapacityModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {nodesSlice.isNoCapacityModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="no-capacity-modal-bg"
        >
          <motion.div
            initial={{ opacity: 0, top: "0" }}
            animate={{ opacity: 1, top: "50%" }}
            exit={{ opacity: 0, top: "0" }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white min-h-[300px] w-[550px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-2xl"
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => dispatch(setIsNoCapacityModalOpen(false))}
            >
              <X />
            </button>
            <div className="flex flex-col gap-10 p-12 md:px-6 md:py-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-3xl text-red-berry font-bold">
                  Not Enough Node Capacity
                </p>
                <p className="text-sm text-text-heading-gray">
                  The node has reached the max limit of 100 delegations. Please select another one with more capacity.
                </p>
                <TriangleAlert color="var(--red-berry)" size={60} />
              </div>
              <button
                className="transition-all ease-in-out bg-sundown border border-sundown p-3 rounded-full font-semibold hover:bg-[transparent]"
                onClick={() => dispatch(setIsNoCapacityModalOpen(false))}
              >
                Ok
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoCapacityModal;
