import React from "react";
import { ServerCrash } from "lucide-react";

const OperatorRegistrationError = (): JSX.Element => {
  return (
    <div className="w-[570px] max-w-[95%] rounded-2xl p-5 items-center flex flex-col text-center gap-[51.3px]">
      <div className="flex flex-col gap-2.5">
        <p className="text-3xl/[29.01px] font-bold">
          Operator Registration Error
        </p>
        <div className="flex flex-col gap-3">
          <p className="text-text-heading-gray">
            An unexpected error occurred while registering your Operator account.
          </p>
          <p className="text-text-heading-gray">
            Please try to Disconnect your wallet and clear browser cache. Then try to register again. If error persist, please try to use a different EOA or Email to register, or {" "}
            <a
              href="mailto:console@fuse.io"
              className="transition ease-in-out underline underline-offset-4 hover:text-darker-gray"
            >
              contact us
            </a>.
          </p>
        </div>
      </div>
      <ServerCrash size={80} />
    </div>
  );
};

export default OperatorRegistrationError;
