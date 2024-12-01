import { useAccount } from "wagmi";

import { setIsWalletModalOpen } from "@/store/navbarSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

import RightCaret from "@/assets/RightCaret";
import { selectAirdropSlice } from "@/store/airdropSlice";
import Spinner from "@/components/ui/Spinner";

const Home = () => {
  const dispatch = useAppDispatch();
  const airdropSlice = useAppSelector(selectAirdropSlice);
  const { isConnecting } = useAccount();

  const isLoading = isConnecting || airdropSlice.isAuthenticating || airdropSlice.isCreating || airdropSlice.isRetrieving;

  return (
    <div className="w-full grow text-fuse-black flex flex-col items-center">
      <div className="w-8/9 flex flex-col justify-center items-center gap-7 text-center my-24 md:my-12 md:w-9/10 max-w-7xl">
        <h1 className="flex flex-col items-center">
          <span className="text-[50px] md:text-2xl leading-none font-semibold">
            Fuse Ember
          </span>
          <span className="text-[200px] md:text-5xl leading-none font-bold">
            Airdrop
          </span>
        </h1>
        <p className="text-lg text-fuse-black max-w-[37rem]">
          Our Incentivized Testnet (Flash) is live. This stage presents exciting opportunities for both on-chain contributors and validators. Click on the button below to participate.
        </p>
        <div className="relative z-10">
          <button
            className="transition-all ease-in-out flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full hover:bg-white hover:text-black"
            disabled={isLoading}
            onClick={() => {
              dispatch(setIsWalletModalOpen(true));
            }}
          >
            Join the Airdrop
            {isLoading ? <Spinner /> : <RightCaret />}
          </button>
          <div className="absolute inset-0 bg-linear-gradient-dark-orange rounded-[inherit] blur-[25px] -z-[1]"></div>
        </div>
        <div>
          What is the Fuse Ember?{" "}
          <a className="font-bold hover:underline" href="#">
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
