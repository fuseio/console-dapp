import React from "react";
import { MoonLoader } from "react-spinners";

const EoaValidation = (): JSX.Element => {
  return (
    <div className="w-[525px] max-w-[95%] rounded-2xl p-5 items-center flex flex-col text-center gap-[51.3px]">
      <div className="flex flex-col gap-2.5">
        <p className="text-3xl/[29.01px] font-bold">
          EOA validation
        </p>
        <div className="flex flex-col">
          <p className="text-text-heading-gray">
            Your externally owned account is about to be validated!
          </p>
          <p className="text-text-heading-gray">
            The process may take 5-10 seconds, please wait.
          </p>
        </div>
      </div>
      <MoonLoader color="#20B92E" />
    </div>
  );
};

export default EoaValidation;
