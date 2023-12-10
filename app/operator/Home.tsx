import Button from "@/components/ui/Button";
import Image from "next/image";
import commerce from "@/assets/commerce.svg"
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useDisconnect } from "wagmi";
import { selectOperatorSlice, setIsSignUpModalOpen } from "@/store/operatorSlice";
import AccountCreationModal from "@/components/operator/AccountCreationModal";
import CongratulationModal from "@/components/operator/CongratulationModal";
import rightArrowBold from "@/assets/right-arrow-bold.svg"
import checkmark from "@/assets/checkmark.svg"

const Home = () => {
  const dispatch = useAppDispatch();
  const { disconnect } = useDisconnect();
  const operatorSlice = useAppSelector(selectOperatorSlice);

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      {operatorSlice.isAccountCreationModalOpen && <AccountCreationModal />}
      {operatorSlice.isCongratulationModalOpen && <CongratulationModal />}
      <div className="w-8/9 flex flex-col mt-16 mb-[187px] md:w-9/10 max-w-7xl">
        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-text-dark-gray leading-[23.68px]">
            Build your business on Fuse Network
          </p>
          <h1 className="text-[50px]/[60.25px] text-fuse-black font-semibold max-w-lg mt-[13.98px] mb-[22px]">
            Launch your project in a few minutes
          </h1>
          <p className="text-text-dark-gray leading-[23.68px] mb-[50.52px] max-w-[362.41px]">
            Start here to build your crypto project with Fuse
            without any crypto experience
          </p>
          <Button
            text="Create Operator Account"
            className="text-lg font-semibold bg-pale-green rounded-full"
            padding="py-4 px-[52px]"
            onClick={() => {
              disconnect();
              dispatch(setIsSignUpModalOpen(true));
            }}
          />
        </div>
        <div className="flex flex-row md:flex-col justify-between gap-4 md:gap-12 bg-lightest-gray rounded-[20px] mt-[90.5px] mb-[173.48px] pt-[61.5px] pr-[65.27px] md:pr-4 pb-[59.3px] pl-[52px] md:pl-4">
          <div>
            <p className="flex justify-center items-center text-3xl leading-none font-semibold h-[50px] w-[50px] bg-white rounded-full">
              1
            </p>
            <p className="text-xl font-semibold mt-[19.6px] mb-[13.8px]">
              Create an operator account
            </p>
            <p className="text-text-dark-gray max-w-[317.11px]">
              If you are a business owner looking for a Web3 payment solution,
              then connect a wallet to the Console and press a button below
              to become an Operator.
            </p>
          </div>
          <div>
            <p className="flex justify-center items-center text-3xl leading-none font-semibold h-[50px] w-[50px] bg-white rounded-full">
              2
            </p>
            <p className="text-xl font-semibold mt-[19.6px] mb-[13.8px]">
              Deposit FUSE tokens
            </p>
            <p className="text-text-dark-gray max-w-[317.11px]">
              Activate your Operator Account by depositing FUSE tokens.
              The funds will be used to cover transaction fees for your customers.
            </p>
          </div>
          <div>
            <p className="flex justify-center items-center text-3xl leading-none font-semibold h-[50px] w-[50px] bg-white rounded-full">
              3
            </p>
            <p className="text-xl font-semibold mt-[19.6px] mb-[13.8px]">
              Get 1000 free transactions
            </p>
            <p className="text-text-dark-gray max-w-[317.11px]">
              Along with account, we will provide you with an API key
              to build your unique Web3 application.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[73.27px]">
          <div className="flex flex-col justify-center items-center text-center gap-[13.25px]">
            <p className="text-3xl text-fuse-black font-semibold">
              What do you want to build today?
            </p>
            <p className="text-lg leading-[21.69px] text-text-dark-gray">
              Here is the list of the Fuse products and solutions
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-[30px]">
            {Array(8).fill(0).map((_, i) =>
              <div key={i} className="bg-white rounded-[20px] max-w-[297px] p-7">
                <div className="h-[53px]">
                  <Image
                    src={commerce}
                    alt="commerce"
                  />
                </div>
                <p className="text-lg font-semibold mt-[19px] mb-[9.8px]">
                  Wallet
                </p>
                <p className="text-night opacity-60">
                  If you are a business owner looking for a Web3 payment button below to become
                </p>
                <button className="group flex items-center gap-2 mt-[22.8px]">
                  <p className="font-bold">
                    View Solutions
                  </p>
                  <Image
                    src={rightArrowBold}
                    alt="right arrow"
                    width={14}
                    height={14}
                    className="transition ease-in-out delay-150 group-hover:translate-x-1"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-16 mt-[169.48px]">
          <div className="flex flex-col justify-center items-center text-center gap-[13.25px]">
            <p className="text-3xl text-fuse-black font-semibold">
              Plans & Pricing
            </p>
            <p className="text-lg leading-[21.69px] text-text-dark-gray">
              Here is the list of the Fuse products and solutions
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-[30px]">
            <div className="flex flex-col gap-[30px] bg-white rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
              <div>
                <p className="text-3xl text-fuse-black font-semibold">
                  Free tier
                </p>
                <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px]">
                  Unlease the power of your buissiness with the starter plan
                </p>
                <div className="flex items-baseline gap-[10.63px]">
                  <p className="text-[50px]/[60.25px] font-semibold">
                    $0
                  </p>
                  <p className="text-night opacity-60">
                    Per month
                  </p>
                </div>
              </div>
              <hr className="w-full h-[0.5px] border-[#C0C0C0]" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1,000 Free transactions
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1M API RPC calls
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1M API calls
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[30px] bg-pale-green-light rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
              <div>
                <div className="flex items-center gap-[13.46px]">
                  <p className="text-3xl text-fuse-black font-semibold">
                    App plan
                  </p>
                  <div className="border border-2 rounded-full px-3 py-1.5">
                    <p className="text-base leading-none font-semibold">
                      Popular
                    </p>
                  </div>
                </div>
                <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px]">
                  Unlease the power of your buissiness with the starter plan
                </p>
                <div className="flex items-baseline gap-[10.63px]">
                  <p className="text-[50px]/[60.25px] font-semibold">
                    $10
                  </p>
                  <p className="text-night opacity-60">
                    Per month
                  </p>
                </div>
              </div>
              <hr className="w-full h-[0.5px] border-[#C0C0C0]" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    Unlimited transactions and RPC
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    Private transactions
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    Subscriptions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[30px] bg-white rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
              <div>
                <p className="text-3xl text-fuse-black font-semibold">
                  Advanced plan
                </p>
                <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px]">
                  Unlease the power of your buissiness with the starter plan
                </p>
                <div className="flex items-baseline gap-[10.63px]">
                  <p className="text-[50px]/[60.25px] font-semibold">
                    0.5%
                  </p>
                  <p className="text-night opacity-60">
                    Per revenue
                  </p>
                </div>
              </div>
              <hr className="w-full h-[0.5px] border-[#C0C0C0]" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    Unlimited transactions and RPC
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1M API RPC calls
                  </p>
                </div>
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1M API calls
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              text="Create Operator Account"
              className="text-lg font-semibold bg-pale-green rounded-full"
              padding="py-4 px-[52px]"
              onClick={() => {
                disconnect();
                dispatch(setIsSignUpModalOpen(true));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
