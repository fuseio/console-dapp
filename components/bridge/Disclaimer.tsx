import React from "react";
import right from "@/assets/right.svg";
import { motion } from "framer-motion";

const Disclaimer = () => {
  const [show, setShow] = React.useState(false);
  return (
    <motion.div className="w-full bg-white px-6 py-5 mt-7 rounded-md flex flex-col overflow-hidden">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <p className="text-base font-semibold">Legal Disclaimer</p>
        <img
          src={right.src}
          alt="right"
          className={show ? "ml-auto h-2 -rotate-90" : "ml-auto h-2 rotate-90"}
        />
      </div>
      {show && (
        <div className="mt-3 text-sm">
          <p>
            The product is in beta form and may therefore contain defects.
            A primary purpose of this beta release is to obtain feedback on
            software and product performance and the identification of defects.
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
            any party due to their use of the beta version, its content,
            and functionalities.
          </p>
          <p className="mt-4">
            Should you encounter any bugs, glitches, lack of functionality,
            or other problems on the beta website, please email us at: &nbsp;
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
  );
};

export default Disclaimer;
