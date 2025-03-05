import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { buildSubMenuItems } from "@/lib/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchOperator, generateSecretApiKey, selectOperatorSlice, setIsRollSecretKeyModalOpen, withRefreshToken } from "@/store/operatorSlice";
import Image from "next/image";
import copy from "@/assets/copy-black.svg";
import NavMenu from "@/components/NavMenu";
import roll from "@/assets/roll.svg";
import Copy from "@/components/ui/Copy";
import DocumentSupport from "@/components/DocumentSupport";
import * as amplitude from "@amplitude/analytics-browser";
import show from "@/assets/show.svg";
import hide from "@/assets/hide.svg";
import contactSupport from "@/assets/contact-support.svg";
import DeveloperTools from "@/components/DeveloperTools";

const Home = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    dispatch(withRefreshToken(() => dispatch(fetchOperator())));
  }, [dispatch])

  return (
    <div className="w-full bg-light-gray flex flex-col items-center">
      <div className="w-8/9 flex flex-col mt-[30.84px] mb-[104.95px] md:mt-12 md:w-9/10 max-w-7xl">
        <div className="flex justify-between items-center">
          <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="api keys" className="md:flex md:justify-center" />
          <div className="flex items-center gap-px md:hidden">
            <Image
              src={contactSupport}
              alt="contact support"
            />
            <div className="flex items-center gap-1">
              <p>
                Not sure what&apos;s next?
              </p>
              <button
                className="underline font-bold"
                onClick={() => {
                  amplitude.track("Contact us - Operators");
                  window.open("https://calendly.com/magali-fuse", "_blank");
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-14 mb-10">
          <h1 className="text-5xl md:text-[32px] text-fuse-black font-semibold leading-none md:leading-tight md:text-center">
            API Keys
          </h1>
        </div>
        <div className="flex md:flex-col gap-[30px] md:gap-5">
          <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] pl-12 pt-12 pr-4 pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px] bg-black">
            <div className="flex flex-col gap-4">
              <p className="text-[20px] leading-none font-bold text-white">
                Send your first transaction
              </p>
              <p className="text-base text-white">
                Learn how to submit your first transaction using a smart contract wallet
              </p>
            </div>
            <button
              className="transition ease-in-out text-black leading-none font-semibold bg-modal-bg rounded-full px-7 py-4 hover:bg-success"
              onClick={() => {
                amplitude.track("Go to Tutorials");
                window.open("https://docs.fuse.io/developers/tutorials/send-your-first-gasless-transaction", "_blank");
              }}
            >
              Start tutorial
            </button>
          </div>
          <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <p className="text-[20px] leading-none font-semibold">
                  Your API Key
                </p>
                <div className="group relative cursor-pointer w-4 h-4 bg-black rounded-full flex justify-center items-center text-xs leading-none text-white">
                  ?
                  <div className="tooltip-text hidden bottom-8 absolute bg-white p-6 rounded-2xl w-[290px] shadow-lg group-hover:block text-black text-sm font-medium">
                    <p>
                      The Fuse Network&apos;s low cost allows for testing with the production API key.
                      For sandbox API key tests on the Spark network, reach out via chat for assistance.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-text-dark-gray md:text-base">
                You will need this API key at the next stage for integration into the SDK
              </p>
            </div>
            <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-sm text-black font-semibold px-5 py-[15px]">
              <p>
                {operatorSlice.operator.project.publicKey}
              </p>
              <Copy
                src={copy}
                text={operatorSlice.operator.project.publicKey}
                tooltipText="API Key copied"
                alt="copy API key"
                width={15}
                height={15}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between items-start gap-y-6 max-w-[407px] rounded-[20px] bg-white pl-12 pt-12 pr-[60px] pb-[55px] md:pl-[30px] md:py-8 md:pr-[23px]">
            <div className="flex flex-col gap-4">
              <p className="text-[20px] leading-none font-semibold">
                Your API secret key
              </p>
              <p className="text-text-dark-gray md:text-base">
                You will need this API secret key for some FuseBox APIs.
              </p>
            </div>
            {operatorSlice.operator.project.secretLastFourChars ?
              <div className="w-full md:min-w-max flex justify-between items-center bg-modal-bg rounded-[31px] border border-black/40 text-xs text-black font-semibold px-5 py-[15px]">
                {operatorSlice.operator.project.secretKey && showSecretKey ?
                  <p>
                    {operatorSlice.operator.project.secretKey}
                  </p> :
                  <p>
                    {operatorSlice.operator.project.secretPrefix}{new Array(20).fill("*")}{operatorSlice.operator.project.secretLastFourChars}
                  </p>
                }
                <div className="flex items-center gap-2">
                  {operatorSlice.operator.project.secretKey &&
                    <Image
                      src={showSecretKey ? show : hide}
                      alt="display secret key"
                      width={20}
                      height={20}
                      title="Display Secret Key"
                      className="cursor-pointer"
                      onClick={() => {
                        setShowSecretKey(!showSecretKey)
                      }}
                    />
                  }
                  <Image
                    src={roll}
                    alt="roll secret key"
                    width={15}
                    height={15}
                    title="Roll Secret Key"
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setIsRollSecretKeyModalOpen(true));
                    }}
                  />
                </div>
              </div> :
              <Button
                text="Generate a new API secret"
                className="transition ease-in-out flex justify-between items-center gap-2 font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
                padding="py-4 px-6"
                onClick={() => {
                  dispatch(withRefreshToken(() => dispatch(generateSecretApiKey())));
                }}
              >
                {operatorSlice.isGeneratingSecretApiKey && <span className="animate-spin border-2 border-light-gray border-t-2 border-t-[#555555] rounded-full w-4 h-4"></span>}
              </Button>
            }
          </div>
        </div>
        <div className="flex flex-col gap-28 mt-28 md:gap-20 md:mt-20">
          <DeveloperTools />
          <DocumentSupport />
        </div>
      </div>
    </div>
  );
};

export default Home;
