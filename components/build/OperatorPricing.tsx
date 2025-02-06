import { path } from "@/lib/helpers";
import Link from "next/link";

const OperatorPricing = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-5xl md:text-3xl leading-tight text-fuse-black font-semibold">
        Choose a plan
      </h1>
      <Link
        href={path.DASHBOARD}
        className="transition ease-in-out px-10 py-3 bg-success border border-success rounded-full text-lg leading-none text-black font-semibold hover:bg-[transparent]"
      >
        Select
      </Link>
    </div>
  );
};

export default OperatorPricing;
