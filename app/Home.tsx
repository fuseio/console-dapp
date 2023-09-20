import Button from "@/components/ui/Button";
import { useConnectWallet } from "@web3-onboard/react";
import dollar from "@/assets/dollar.svg"
import receive from "@/assets/receive.svg"
import send from "@/assets/send.svg"
import rightArrow from "@/assets/right-arrow.svg"
import { eclipseAddress } from "@/lib/helpers";
import copy from "@/assets/copy2.svg";

const Home = () => {
  const [{ wallet }] = useConnectWallet();

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col gap-y-16 mt-14 mb-40 md:w-9/10 max-w-7xl">
        <div>
          <h1 className="font-black text-5xl leading-none md:text-4xl">
            Console
          </h1>
          <p className="text-xl font-normal mt-4 text-text-dark-gray md:text-base">
            One-stop-shop for all Fuse token holders.
          </p>
        </div>
        <div className="flex flex-col gap-y-[30px]">
          <div className="bg-fuse-black rounded-[20px] text-white px-12 py-14">
            <div className="flex flex-row justify-between md:flex-col gap-12">
              <div className="flex flex-col gap-y-[62px]">
                <div className="flex flex-col gap-y-[18px]">
                  <p className="text-lg text-darker-gray">
                    Balance
                  </p>
                  <div className="flex items-end gap-x-[30px]">
                    <h1 className="font-black text-5xl leading-none md:text-4xl">
                      0.4956 FUSE
                    </h1>
                    <p className="text-xl text-darker-gray">
                      $2.0123
                    </p>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-[30px]">
                  <Button
                    text={"Buy Fuse"}
                    disabled={!!!wallet}
                    padding="py-5"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-success text-black font-semibold rounded-full"
                    disabledClassname="flex items-center justify-center gap-x-2.5 w-40 bg-button-inactive text-black font-semibold rounded-full"
                    isLeft
                  >
                    <img src={dollar.src} alt="dollar" />
                  </Button>
                  <Button
                    text={"Stake"}
                    disabled={!!!wallet}
                    padding="py-5"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-white text-black font-semibold rounded-full"
                    disabledClassname="flex items-center justify-center gap-x-2.5 w-40 bg-button-inactive text-black font-semibold rounded-full"
                    isLeft
                  >
                    <img src={receive.src} alt="receive" />
                  </Button>
                  <Button
                    text={"Bridge"}
                    disabled={!!!wallet}
                    padding="py-5"
                    className="flex items-center justify-center gap-x-2.5 w-40 bg-white text-black font-semibold rounded-full"
                    disabledClassname="flex items-center justify-center gap-x-2.5 w-40 bg-button-inactive text-black font-semibold rounded-full"
                    isLeft
                  >
                    <img src={send.src} alt="send" />
                  </Button>
                </div>
              </div>
              {wallet &&
                <div className="flex flex-col gap-4 md:flex-row">
                  <p className="text-success">
                    Wallet Address
                  </p>
                  <span className="text-darker-gray text-base flex">
                    {eclipseAddress(wallet?.accounts[0].address)}
                    <img
                      src={copy.src}
                      alt="Copy"
                      className="ms-2 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(wallet?.accounts[0].address);
                      }}
                    />
                  </span>
                </div>
              }
            </div>
          </div>
          <div className="grid grid-cols-auto-fit-400 gap-[30px]">
            <div className="flex flex-col justify-start items-start gap-y-[34px] max-w-[407px] md:w-9/10 rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[35px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Build on Fuse
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  Join the Fuse console list to be the first
                  to receive latest news, access to new features
                  and special offers.
                </p>
              </div>
              <div className="flex gap-8">
                <a href="#" className="group flex gap-1 text-black font-semibold">
                  <p>Contact us</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
                <a href="#" className="group flex gap-1 text-black font-semibold">
                  <p>Read docs</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-y-[34px] max-w-[407px] md:w-9/10 rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[35px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Get API Key
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  Sign in to our developer dashboard to
                  receive your API key and start using the
                  Fuse SDK
                </p>
              </div>
              <div className="flex gap-8">
                <a href="#" className="group flex gap-1 text-black font-semibold">
                  <p>Get API key</p>
                  <img src={rightArrow.src} alt="right arrow" className="transition ease-in-out delay-150 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-y-[34px] max-w-[407px] md:w-9/10 rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[35px]">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-bold">
                  Operator Account
                </p>
                <p className="text-xl font-normal text-text-dark-gray md:text-base">
                  The Operator's account is a single
                  information and control panel for
                  Operators.
                </p>
              </div>
              <div className="flex gap-8">
                <div className="py-3.5 px-4 rounded-xl bg-success/40 text-success-dark font-semibold">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
