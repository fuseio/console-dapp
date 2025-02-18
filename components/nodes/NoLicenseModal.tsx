import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectNodesSlice, setIsNoLicenseModalOpen } from "@/store/nodesSlice";

const NoLicenseModal = (): JSX.Element => {
  const nodesSlice = useAppSelector(selectNodesSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "no-license-modal-bg") {
        dispatch(setIsNoLicenseModalOpen(false));
      }
    });
  }, [dispatch]);

  return (
    <AnimatePresence>
      {nodesSlice.isNoLicenseModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex"
          id="no-license-modal-bg"
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
              onClick={() => dispatch(setIsNoLicenseModalOpen(false))}
            >
              <X />
            </button>
            <div className="flex flex-col gap-10 p-12 md:px-6 md:py-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-3xl text-red-berry font-bold">
                  No available licenses
                </p>
                <p className="text-sm text-text-heading-gray">
                  All of your licenses have been delegated. You need to acquire more licenses or revoke some existing ones to continue
                </p>
                <TriangleAlert color="var(--red-berry)" size={60} />
              </div>
              <button
                className="transition-all ease-in-out bg-sundown border border-sundown p-3 rounded-full font-semibold hover:bg-[transparent]"
                onClick={() => dispatch(setIsNoLicenseModalOpen(false))}
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

export default NoLicenseModal;
