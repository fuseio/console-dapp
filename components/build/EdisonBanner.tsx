import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {useAppSelector} from "@/store/store";
import {selectOperatorSlice} from "@/store/operatorSlice";
import {path} from "@/lib/helpers";

import edisonGray from "@/assets/edison-gray.svg";
import edisonChat from "@/assets/edison-chat.svg";
import rightArrowBold from "@/assets/right-arrow-bold.svg";

interface EdisonBannerProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const EdisonBanner = ({
  title = "What can Edison do for you?",
  description = "Experience the power of blockchain without the complexity. Ask the Fuse AI Agent to handle your Fuse Network transactions, manage assets, and navigate DeFi services.",
  onClick,
}: EdisonBannerProps) => {
  const {isAuthenticated} = useAppSelector(selectOperatorSlice);
  const router = useRouter();

  function redirectEdison() {
    router.push(isAuthenticated ? path.AI_AGENT : path.BUILD_REGISTER);
  }

  return (
    <article className="grid grid-cols-2 gap-10 bg-lightest-gray rounded-[20px] p-10 lg:grid-cols-1">
      <div className="flex flex-col items-start gap-8">
        <Image src={edisonGray} alt="edison gray" width={181} height={46} />
        <h2 className="text-5xl text-fuse-black font-semibold max-w-lg md:text-2xl">
          {title}
        </h2>
        <p className="text-[1.25rem] text-text-dark-gray md:text-base">
          {description}
        </p>
        <div className="flex gap-8 md:flex-col">
          <button
            className="transition ease-in-out px-10 py-4 bg-fuse-black border border-fuse-black rounded-full text-lg leading-none text-white font-semibold hover:bg-[transparent] hover:text-fuse-black"
            onClick={() => (onClick ? onClick() : redirectEdison())}
          >
            Start building
          </button>
          <Link
            href="https://news.fuse.io/introducing-edison-the-first-ai-payments-agent-on-fuse/"
            target="_blank"
            className="group flex items-center gap-1 text-lg font-semibold"
          >
            Learn more
            <Image
              src={rightArrowBold}
              alt="right arrow"
              width={20}
              height={20}
              className="transition ease-in-out group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Image src={edisonChat} alt="edison chat" width={453} height={300} />
      </div>
    </article>
  );
};

export default EdisonBanner;
