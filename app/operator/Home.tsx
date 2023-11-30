import Button from "@/components/ui/Button";
import Image from "next/image";
import mobilePayment from "@/assets/mobile-payment.svg"
import commerce from "@/assets/commerce.svg"
import loyalty from "@/assets/loyalty.svg"
import stablecoins from "@/assets/stablecoins.svg"
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useDisconnect } from "wagmi";
import { selectOperatorSlice, setIsSignUpModalOpen } from "@/store/operatorSlice";
import AccountCreationModal from "@/components/operator/AccountCreationModal";
import CongratulationModal from "@/components/operator/CongratulationModal";

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
        <div className="flex flex-row md:flex-col justify-between gap-4 md:gap-12 bg-lightest-gray rounded-[20px] mt-[90.5px] mb-[79px] pt-[61.5px] pr-[65.27px] md:pr-4 pb-[59.3px] pl-[52px] md:pl-4">
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
        <div className="flex flex-col gap-[60.27px] bg-white rounded-[20px] pt-[94.48px] pr-[85.54px] md:pr-4 pb-[92.31px] pl-[79.96px] md:pl-4">
          <div className="flex flex-col gap-[13.25px] justify-center items-center text-center">
            <p className="text-3xl text-fuse-black font-semibold">
              Learn what you can do as an operator
            </p>
            <p className="text-lg text-text-dark-gray">
              Check out some guids for the most common use cases
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-4 md:gap-12 justify-between">
            <div>
              <div className="h-[53px]">
                <Image
                  src={mobilePayment}
                  alt="mobile payment"
                />
              </div>
              <p className="text-xl text-fuse-black font-semibold mt-[28.42px] mb-[9.59px]">
                Mobile payments
              </p>
              <p className="text-text-dark-gray max-w-[240px]">
                Fuse equips developers with user-friendly, mobile-first tools,
                empowering them to craft Web3 apps that shine on smartphones and
                tablets effortlessly.
              </p>
            </div>
            <div>
              <div className="h-[53px]">
                <Image
                  src={commerce}
                  alt="commerce"
                />
              </div>
              <p className="text-xl text-fuse-black font-semibold mt-[28.42px] mb-[9.59px]">
                Commerce
              </p>
              <p className="text-text-dark-gray max-w-[240px]">
                Fuse is a cost-effective, fast choice for e-commerce,
                offering efficient payments with reduced overhead and expanded reach.
              </p>
            </div>
            <div>
              <div className="h-[53px]">
                <Image
                  src={loyalty}
                  alt="loyalty"
                />
              </div>
              <p className="text-xl text-fuse-black font-semibold mt-[28.42px] mb-[9.59px]">
                Loyalty & Rewards
              </p>
              <p className="text-text-dark-gray max-w-[240px]">
                Provide NFT-based loyalty programs and redeemable token rewards
                to revolutionize loyalty systems and bring blockchain to mainstream users.
              </p>
            </div>
            <div>
              <div className="h-[53px]">
                <Image
                  src={stablecoins}
                  alt="stablecoins"
                />
              </div>
              <p className="text-xl text-fuse-black font-semibold mt-[28.42px] mb-[9.59px]">
                Branded Stablecoins
              </p>
              <p className="text-text-dark-gray max-w-[240px]">
                Fuse&apos;s branded stablecoins boost brand visibility, reduce payment volatility,
                expand global reach, and provide Web3 efficiency and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
