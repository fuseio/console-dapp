import React from "react";
import { ServerCrash } from "lucide-react";

import { useAppDispatch } from "@/store/store";
import { setLogout } from "@/store/operatorSlice";

type OperatorRegistrationErrorProps = {
  error?: string;
};

const OperatorRegistrationError = ({ error }: OperatorRegistrationErrorProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleTryAgain = () => {
    // Clear any stale operator/session state, then restart the registration flow
    // from a clean slate so a connected wallet re-validates instead of staying
    // stranded on this screen.
    dispatch(setLogout());
    window.location.reload();
  };

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
          {error && (
            <p className="text-sm text-[#FD0F0F] break-words">
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={handleTryAgain}
          className="transition ease-in-out bg-black border border-black text-white font-semibold leading-none rounded-full px-8 py-3 hover:bg-[transparent] hover:text-black"
        >
          Try again
        </button>
        <ServerCrash size={80} />
      </div>
    </div>
  );
};

export default OperatorRegistrationError;
