import React from "react";
import { GridLoader } from "react-spinners";

const AccountCreation = (): JSX.Element => {
  return (
    <div className="w-[525px] max-w-[95%] rounded-2xl p-5 items-center flex flex-col text-center gap-[51.3px]">
      <div className="flex flex-col gap-2.5">
        <p className="text-3xl/[29.01px] font-bold">
          Account creation
        </p>
        <div className="flex flex-col">
          <p className="text-text-heading-gray">
            Your operator account is about to be deployed!
          </p>
          <p className="text-text-heading-gray">
            The process may take 10-15 seconds, please wait.
          </p>
        </div>
      </div>
      <GridLoader color="#20B92E" />
    </div>
  );
};

export default AccountCreation;
