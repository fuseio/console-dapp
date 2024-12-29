import { defaultReferralCode, path } from "@/lib/helpers";
import { useAppDispatch } from "@/store/store";
import { setInviteCode } from "@/store/airdropSlice";
import { useState } from "react";
import OTPInput from "react-otp-input";
import Image from "next/image";
import emberIcon from "@/assets/ember-icon.svg";
import { useRouter } from "next/navigation";

type JoinAirdropProps = {
  invite: string;
  setInvite: (invite: string) => void;
}

const JoinAirdrop = ({ invite, setInvite }: JoinAirdropProps) => {
  const dispatch = useAppDispatch();
  const [isInputClicked, setIsInputClicked] = useState(false);
  const router = useRouter();

  return (
    <form
      className="flex flex-row md:flex-col items-center gap-5 md:gap-3 z-10"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          invite.length !== defaultReferralCode.length &&
          invite.length !== 0
        ) {
          return;
        }
        dispatch(setInviteCode(invite.length === 0 ? defaultReferralCode : invite));
      }}
    >
      <OTPInput
        value={invite}
        onChange={setInvite}
        numInputs={5}
        renderInput={(props, index) =>
          <input
            {...props}
            className={`${props.className} ${invite.length === index ? "animate-blink-underline" : "border-white/50"}`}
            onClick={() => {
              if (isInputClicked) {
                return;
              }
              setInvite("");
              setIsInputClicked(true);
            }}
          />
        }
        containerStyle={"gap-2 bg-white rounded-full px-[30px] py-3.5"}
        inputStyle="bg-transparent border-b text-center text-[1.25rem] leading-none font-bold w-9 focus:outline-none"
        skipDefaultStyles
      />
      <button
        type="submit"
        className="transition ease-in-out bg-fuse-black border border-fuse-black flex justify-center items-center gap-2 rounded-full text-[1.25rem] leading-none text-white font-semibold px-6 py-2.5 md:w-full hover:bg-transparent hover:border-fuse-black hover:text-fuse-black"
        onClick={() => router.push(path.AIRDROP_ECOSYSTEM)}
      >
        Join
        <Image
          src={emberIcon}
          alt="ember icon"
          width={22}
          height={28}
        />
      </button>
    </form>
  )
}

export default JoinAirdrop;
