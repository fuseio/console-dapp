import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { defaultReferralCode } from "@/lib/helpers";
import JoinAirdrop from "@/components/airdrop/JoinAirdrop";

const Home = () => {
  const [invite, setInvite] = useState('');
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    if (referralCode) {
      setInvite(referralCode);
    } else {
      setInvite(defaultReferralCode);
    }
  }, [referralCode])

  return (
    <div className="w-full h-screen bg-[url('/vectors/airdrop-background.png')] bg-cover bg-center bg-no-repeat text-fuse-black flex flex-col items-center">
      <div className="w-8/9 flex flex-col justify-center items-center gap-7 text-center my-32 md:my-12 md:w-9/10 max-w-7xl">
        <h1 className="text-[70px]/[84.35px] md:text-[32px] leading-none font-semibold max-w-2xl">
          Welcome to the fuse Campaign
        </h1>
        <p className="text-[1.25rem]/[1.5rem] max-w-[38rem]">
          Join the Fuse Airdrop! Get into the Fuse, connect your wallet and earn Rewards with ease: Join the Explosive Airdrop Campaign
        </p>
        <div className="flex flex-col gap-3.5 mt-8">
          <p className="text-[1.25rem]/[1.5rem] font-bold">
            Enter invite code
          </p>
          <JoinAirdrop invite={invite} setInvite={setInvite} />
        </div>
      </div>
    </div>
  );
};

export default Home;
