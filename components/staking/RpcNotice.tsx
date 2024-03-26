import Image from "next/image";
import warningTransparent from "@/assets/warning-transparent.svg";

const RpcNotice = () => {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <Image
        src={warningTransparent}
        alt="warning"
      />
      <p className="text-xl text-black font-bold">
        Notice!
      </p>
      <p className="text-text-heading-gray max-w-[461px]">
        Unfortunately, RPC is too busy at the moment. We are already working on a solution
        that will prevent such incidents in the future. Please come back a bit later.
      </p>
      <button
        className="transition ease-in-out bg-black rounded-full text-sm leading-none text-white font-medium px-8 py-4 hover:bg-white hover:text-black"
        onClick={() => window.location.reload()}
      >
        Reload page
      </button>
    </div>
  )
}

export default RpcNotice;
