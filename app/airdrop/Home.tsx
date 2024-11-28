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
        <h1 className="text-[70px]/[84.35px] md:text-[32px] leading-none font-semibold max-w-2xl">
          Join the Ember Testnet!
        </h1>
        <p className="text-lg text-fuse-black max-w-[37rem]">
          Our Incentivized Testnet (Flash) is live. This stage presents exciting opportunities for both on-chain contributors and validators. Click on the button below to participate.
        </p>
        <button
          className="transition-all ease-in-out flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full hover:bg-white hover:text-black"
          disabled={isLoading}
          onClick={() => {
            dispatch(setIsWalletModalOpen(true));
          }}
        >
          Participate in Incentivized Testnet
          {isLoading ? <Spinner /> : <RightCaret />}
        </button>
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
