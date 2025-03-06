import React from "react";
import { useAccount, useSignMessage } from "wagmi";

import { signDataMessage } from "@/lib/helpers";
import { validateOperator } from "@/store/operatorSlice";
import { useAppDispatch } from "@/store/store";
import Spinner from "../ui/Spinner";

const ValidateEoa = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { address } = useAccount()
  const { signMessage, isPending } = useSignMessage({
    mutation: {
      onSuccess(data) {
        if (!address) {
          return;
        }
        dispatch(validateOperator({
          signData: {
            externallyOwnedAccountAddress: address,
            message: signDataMessage,
            signature: data
          },
        }));
      }
    }
  })

  return (
    <div className="w-[525px] max-w-[95%] rounded-2xl p-5 items-center flex flex-col text-center gap-4">
      <div className="flex flex-col gap-2.5">
        <p className="text-3xl/[29.01px] font-bold">
          Validate EOA
        </p>
        <div className="flex flex-col">
          <p className="text-text-heading-gray">
            Validating your externally owned account is required!
          </p>
        </div>
      </div>
      <button
        className="transition ease-in-out flex items-center gap-2 px-8 py-3 w-fit bg-black border border-black text-white font-semibold leading-none rounded-full hover:bg-[transparent] hover:text-black"
        onClick={() => signMessage({ message: signDataMessage })}
      >
        Validate
        {isPending && <Spinner />}
      </button>
    </div>
  );
};

export default ValidateEoa;
