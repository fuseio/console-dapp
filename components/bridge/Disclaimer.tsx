import React from "react";
import right from "@/assets/right.svg";
import close from "@/assets/close.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import Image from "next/image";

const Disclaimer = () => {
  const [show, setShow] = React.useState(false);
  const ref = useOutsideClick(() => {
    if (show) {
      setShow(false);
    }
  });
  return (
    <>
      <motion.div className="w-full bg-white px-6 py-5 mt-7 rounded-md flex flex-col overflow-hidden">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <p className="text-base font-semibold">Legal Disclaimer</p>
          <Image
            src={right}
            alt="right"
            className={
              show ? "ml-auto h-2 -rotate-90" : "ml-auto h-2 rotate-90"
            }
          />
        </div>
        {show && (
          <div className="mt-3 text-sm md:hidden">
            <p>
              The product is in beta form and may therefore contain defects. A
              primary purpose of this beta release is to obtain feedback on
              software and product performance and the identification of
              defects.
            </p>
            <p className="mt-4">
              You are advised to use caution and not to rely in any way on the
              constant correct functioning or performance of the products and/or
              accompanying products and services relating to this beta version.
            </p>
            <p className="mt-4">
              Fuse does not give any express or implied warranties regarding the
              suitability or usability of this product, software, and/or its
              content in the beta version. Fuse will not be liable for any loss,
              whether direct or indirect, special or consequential, suffered by
              any party due to their use of the beta version, its content, and
              functionalities.
            </p>
            <p className="mt-4">
              Should you encounter any bugs, glitches, lack of functionality, or
              other problems on the beta website, please email us at: &nbsp;
              <a
                href="mailto:bridge@fuse.io?subject=Fuse Bridge (Beta) feedback"
                className="underline text-lightBlue"
              >
                bridge@fuse.io
              </a>
            </p>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 hidden md:flex"
            id="modal-bg"
          >
            <motion.div
              initial={{ opacity: 0, top: "0" }}
              animate={{ opacity: 1, top: "50%" }}
              exit={{ opacity: 0, top: "0" }}
              transition={{
                duration: 0.3,
              }}
              ref={ref}
              className="bg-white min-h-[504px] w-[396px] max-w-[95%] z-50 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-lg p-5 items-center flex-col hidden md:flex"
            >
              <span className="flex w-full justify-between items-start">
                <p className="text-base font-semibold">Legal Disclaimer</p>
                <Image
                  src={close}
                  alt="close"
                  className="cursor-pointer w-6"
                  onClick={() => setShow(false)}
                />
              </span>
              <div className="mt-3 text-sm text-text-heading-gray">
                <p>
                  The product is in beta form and may therefore contain defects.
                  A primary purpose of this beta release is to obtain feedback
                  on software and product performance and the identification of
                  defects.
                </p>
                <p className="mt-4">
                  You are advised to use caution and not to rely in any way on
                  the constant correct functioning or performance of the
                  products and/or accompanying products and services relating to
                  this beta version. Fuse does not give any express or implied
                  warranties regarding the suitability or usability of this
                  product, software, and/or its content in the beta version.
                  Fuse will not be liable for any loss, whether direct or
                  indirect, special or consequential, suffered by any party due
                  to their use of the beta version, its content, and
                  functionalities.
                </p>
                <p className="mt-4">
                  Should you encounter any bugs, glitches, lack of
                  functionality, or other problems on the beta website, please
                  email us at: &nbsp;
                  <a
                    href="mailto:bridge@fuse.io?subject=Fuse Bridge (Beta) feedback"
                    className="underline text-lightBlue"
                  >
                    bridge@fuse.io
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Disclaimer;
