import Button from "@/components/ui/Button";
import Image from "next/image";
import checkmark from "@/assets/checkmark.svg"
import checkmarkBg from "@/assets/checkmark-bg.svg"
import requestFinance from "@/public/request-finance.png"
import transak from "@/public/transak.png"
import thirdweb from "@/public/thirdweb.png"
import cointool from "@/public/cointool.png"
import theGraph from "@/public/the-graph.png"
import taskOn from "@/public/taskon.png"
import { useRouter } from "next/navigation";
import NavMenu from "@/components/NavMenu";
import { buildSubMenuItems, buildVisitorSubMenuItems, path } from "@/lib/helpers";
import * as amplitude from "@amplitude/analytics-browser";
import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";

const apps = [
  {
    name: "Create an invoice",
    description: "A decentralized protocol that allows for efficient crypto payments",
    logo: requestFinance,
    link: "https://www.fuse.io/ecosystem-project/request-finance"
  },
  {
    name: "Onramp from your bank",
    description: "Developer integration toolkit powering the best in Web3 payments",
    logo: transak,
    link: "https://www.fuse.io/ecosystem-project/transak"
  },
  {
    name: "Deploy a contract",
    description: "ThirdWeb provides a complete set of tools for building Web3 applications",
    logo: thirdweb,
    link: "https://www.fuse.io/ecosystem-project/thirdweb"
  },
  {
    name: "Create a token",
    description: "Multichain digital currency toolbox facilitating Web3 development",
    logo: cointool,
    link: "https://www.fuse.io/ecosystem-project/cointool"
  },
  {
    name: "Deploy a subgraph",
    description: "Indexing protocol securing users' access to blockchain data via GraphQL",
    logo: theGraph,
    link: "https://www.fuse.io/ecosystem-project/the-graph"
  },
  {
    name: "Create an air drop campaign",
    description: "TaskOn is a Web3 Collaboration Platform offering rewards, exclusive Web3 project insights, and more.",
    logo: taskOn,
    link: "https://www.fuse.io/ecosystem-project/taskon"
  },
]

const Home = () => {
  const router = useRouter();
  const operatorSlice = useAppSelector(selectOperatorSlice);

  function createAccount(eventInput: string) {
    amplitude.track(eventInput);
    router.push(operatorSlice.isAuthenticated ? path.DASHBOARD : path.BUILD_REGISTER);
  }

  return (
    <div className="w-full bg-light-gray">
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col mt-[30.84px] md:mt-12 md:w-9/10 max-w-7xl">
          <NavMenu menuItems={operatorSlice.isAuthenticated ? buildSubMenuItems : buildVisitorSubMenuItems} isOpen={true} selected="welcome" className="md:flex" isResponsive />
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col mt-[76.29px] md:mt-14 md:w-9/10 max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-[70px]/[84.35px] md:text-[32px] md:leading-tight text-fuse-black font-semibold max-w-[729.99px] mt-[13.98px] mb-[22px]">
              Build your Web3 Project with Fuse
            </h1>
            <p className="text-[20px]/7 text-text-dark-gray mb-[50.52px] md:mb-[18px] max-w-[455px]">
              Your all-in-one solution for effortlessly launching your decentralized Web3 application
            </p>
            <Button
              text="Create your project"
              className="transition ease-in-out text-lg leading-none font-semibold bg-pale-green rounded-full hover:bg-white"
              padding="py-4 px-[52px]"
              onClick={() => createAccount("Build-Welcome: Create project - upper")}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
          <div className="flex flex-row md:flex-col justify-center gap-[31px] md:gap-[21px] mt-[117.5px] mb-[119px] md:mb-[70px] md:mt-[54px]">
            <div className="bg-white rounded-[20px] p-[51px] md:pl-[30px] md:py-[30px] md:pr-5 w-full max-w-[623px] md:max-w-none h-[800px] md:h-[578px] bg-[url('/vectors/get-mobiles.svg')] md:bg-[url('/vectors/get-mobiles-responsive.svg')] bg-no-repeat bg-bottom md:bg-contain">
              <p className="text-[34px] md:text-[32px] md:leading-tight text-fuse-black font-bold md:font-semibold">
                Get started
              </p>
              <p className="text-[20px]/7 md:text-base text-text-dark-gray mt-[30.61px] mb-[38.67px] md:mt-5 md:mb-6 max-w-[395.25px]">
                Begin your crypto project on Fuse now, no prior experience required
              </p>
              <div className="rounded-[20px] pt-[35.4px] px-10 pb-[50px] md:px-0 md:py-0">
                <div className="flex flex-col gap-[25.79px] md:gap-7">
                  <div className="flex items-baseline gap-1">
                    <p className="text-[50px] md:text-5xl leading-none text-fuse-black font-bold">
                      $0
                    </p>
                    <p className="leading-none">
                      per month
                    </p>
                  </div>
                  <div className="flex flex-col gap-[18.73px] md:gap-4">
                    <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-[20px]/7 md:text-base font-bold">
                        1000 transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[30px] md:gap-5 w-[626px] md:w-auto">
              <div className="bg-white rounded-[20px] md:flex md:flex-col md:justify-end pt-[50px] px-[47.5px] md:px-6 md:py-[30px] h-[385px] md:h-[431px] bg-[url('/vectors/create-mobiles.svg')] md:bg-[url('/vectors/create-mobiles-responsive.svg')] bg-no-repeat bg-bottom md:bg-top md:bg-contain">
                <p className="text-[34px]/[40.97px] md:text-[32px] md:leading-tight text-fuse-black font-bold md:font-semibold max-w-[473.16px]">
                  Create programable wallets for your customers
                </p>
                <p className="text-[20px]/7 md:text-base text-text-dark-gray mt-[12.98px] md:mt-2.5 max-w-[352.54px]">
                  Quickly launch a wallet for your customers
                </p>
              </div>
              <div className="bg-white rounded-[20px] pt-[50px] px-[47.5px] lg:pl-[30px] lg:py-[30px] lg:pr-1.5 h-[385px] md:h-auto">
                <p className="text-[34px]/[40.97px] md:text-[32px] md:leading-tight text-fuse-black font-bold md:font-semibold">
                  Mobile and Web SDKs
                </p>
                <p className="text-[20px]/7 md:text-base text-text-dark-gray mt-[12.98px] mb-[25.31px] md:mt-[18px] md:mb-[27px] md:max-w-[257px]">
                  Implement account abstraction out-of-the-box:
                </p>
                <div className="flex flex-col gap-[18.73px]">
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray">
                      Social logins
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray">
                      Gasless transactions
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray">
                      Business automations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
          <div className="flex flex-col gap-28 md:gap-[26px]">
            <div className="flex justify-center text-center">
              <p className="text-[34px]/[50.32px] md:text-[32px] md:leading-tight font-bold md:font-semibold max-w-[688.35px]">
                Introduce your users to Web3 with a cost-effective approach
              </p>
            </div>
            <div className="flex flex-row md:flex-col gap-[85.15px] md:gap-[18.73px] px-[54.46px] py-[53.36px] md:pl-[30px] md:py-[30px] md:pr-[10px] min-h-[618px] md:min-h-[870px] bg-white rounded-[20px] bg-[url('/vectors/ecosystem.svg')] md:bg-[url('/vectors/ecosystem-responsive.svg')] bg-no-repeat bg-right-bottom md:bg-contain">
              <div>
                <p className="text-[34px]/[40.97px] md:text-[32px] md:leading-tight text-fuse-black font-bold md:font-semibold">
                  An ecosystem for Web3 payments
                </p>
                <p className="text-[20px]/7 md:text-base text-text-dark-gray mt-[32.14px] mb-[90.51px] md:mt-2.5 md:mb-[31px] max-w-[395.25px] md:max-w-[340px]">
                  Access a comprehensive suite of value-added services with a Fuse Operator account,
                  all under a straightforward pricing model.
                </p>
                <div className="flex flex-col gap-[18.73px]">
                  <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                      KYC and fiat on/off-ramping
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                      Recurring payments - coming soon
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                      Private business transactions - coming soon
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[18.73px]">
                <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                    Most reliable business stack in Web3
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                    Pay as you go only if you have traction
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                    High availability for real time payments
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px] md:gap-[9px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-[20px]/7 md:text-base text-text-dark-gray font-bold">
                    Fault tolerance - build once and scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-fuse-black pt-[122.6px] pb-[147px] md:pt-[59px] md:pb-[58px] mt-[368px] mb-[169.47px] md:mt-20 md:mb-16 bg-[url('/vectors/pluses.svg')]">
        <div className="w-full flex flex-col items-center">
          <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
            <div className="flex flex-col gap-[91px] md:gap-[52px]">
              <div className="flex flex-col items-center text-center gap-[22px]">
                <p className="text-[40px]/[48.2px] md:text-[32px] md:leading-tight text-white font-bold md:max-w-[294.71px]">
                  Explore our Apps & Services
                </p>
                <p className="text-[20px]/7 md:text-base text-white max-w-[756.49px] md:max-w-[347.38px]">
                  Streamline your operations with reliable, ready-to-use third-party solutions on the Fuse Network.
                  Find and integrate the services your business needs.
                </p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-1 justify-between gap-[30px] md:gap-5">
                {apps.map((app, i) =>
                  <a
                    key={i}
                    href={app.link}
                    target="_blank"
                    className="flex flex-col gap-2.5 justify-between min-h-[269px] px-[30px] py-7 bg-white/5 hover:bg-white/10 rounded-[20px]"
                  >
                    <div className="flex flex-col gap-2.5">
                      <p className="text-2xl text-white font-semibold">
                        {app.name}
                      </p>
                      <p className="text-white opacity-60 max-w-[282.15px]">
                        {app.description}
                      </p>
                    </div>
                    <Image
                      src={app.logo}
                      alt={app.name}
                    />
                  </a>
                )}
              </div>
              <div className="flex justify-center">
                <a
                  href="https://www.fuse.io/ecosystem"
                  target="_blank"
                  className="transition ease-in-out bg-white rounded-full text-lg leading-none font-semibold text-center px-[36.5px] py-4 hover:bg-success"
                >
                  Explore more ecosystem partners
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center md:mb-16">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col justify-center items-center text-center gap-[13.25px]">
              <p className="text-5xl md:text-[32px] md:leading-tight text-fuse-black font-bold">
                Plans & Pricing
              </p>
              <p className="text-[20px]/7 md:text-base leading-[21.69px] text-text-dark-gray">
                Here is the list of the Fuse products and solutions
              </p>
            </div>
            <div className="flex grid grid-cols-3 lg:grid-cols-1 gap-[30px]">
              <div className="flex flex-col gap-[30px] rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <p className="text-3xl text-fuse-black font-semibold">
                    Free plan
                  </p>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px] max-w-[300px]">
                    Start receiving crypto payments in just a few clicks
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
                <div className="flex flex-col gap-4 h-[200px] md:h-auto">
                  <div className="flex items-center gap-[13.98px]">
                    <Image
                      src={checkmark}
                      alt="checkmark"
                      width={15.64}
                      height={10.5}
                    />
                    <p>
                      Up to 1000 monthly transactions
                    </p>
                  </div>
                </div>
                <Button
                  text="Get Started"
                  className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:bg-white hover:text-black"
                  padding="py-4 px-[52px] mt-[25.88px]"
                  onClick={() => createAccount("Get started: Starter")}
                />
              </div>
              <div className="flex flex-col gap-[30px] bg-white rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <div className="flex items-center gap-[13.46px]">
                    <p className="text-3xl text-fuse-black font-semibold">
                      Basic plan
                    </p>
                    <div className="border border-2 rounded-full px-3 py-1.5">
                      <p className="text-base leading-none font-semibold">
                        Popular
                      </p>
                    </div>
                  </div>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px] max-w-[300px]">
                    Robust service. Low price.
                  </p>
                  <div className="flex items-baseline gap-[10.63px]">
                    <p className="text-[50px]/[60.25px] font-semibold">
                      $50
                    </p>
                    <p className="text-night opacity-60">
                      Per month
                    </p>
                  </div>
                </div>
                <hr className="w-full h-[0.5px] border-[#C0C0C0]" />
                <div className="flex flex-col gap-4 h-[200px] md:h-auto">
                  <div className="flex items-center gap-[13.98px]">
                    <Image
                      src={checkmark}
                      alt="checkmark"
                      width={15.64}
                      height={10.5}
                    />
                    <p>
                      1M transactions
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
                      Access to all services on Fuse
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
                      Reliable and fast support
                    </p>
                  </div>
                </div>
                <Button
                  text="Get Started"
                  className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:bg-success hover:text-black"
                  padding="py-4 px-[52px] mt-[25.88px]"
                  onClick={() => createAccount("Get started: Pro")}
                />
              </div>
              <div className="flex flex-col gap-[30px] rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <p className="text-3xl text-fuse-black font-semibold">
                    Premium Plan
                  </p>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px]">
                    Get more. Maximize your business potential
                  </p>
                  <div className="flex items-baseline gap-[10.63px]">
                    <p className="text-[50px]/[60.25px] font-semibold">
                      $500
                    </p>
                    <p className="text-night opacity-60">
                      Per month
                    </p>
                  </div>
                </div>
                <hr className="w-full h-[0.5px] border-[#C0C0C0]" />
                <div className="flex flex-col gap-4 h-[200px] md:h-auto">
                  <div className="flex items-center gap-[13.98px]">
                    <Image
                      src={checkmark}
                      alt="checkmark"
                      width={15.64}
                      height={10.5}
                    />
                    <p>
                      Everything in the Basic plan +
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
                      Unlimited transactions
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
                      Individual support approach
                    </p>
                  </div>
                </div>
                <Button
                  text="Coming soon"
                  className="text-lg text-white leading-none font-semibold bg-iron rounded-full"
                  padding="py-4 px-[52px] mt-[25.88px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-[169.47px] mb-[187px] md:hidden">
        <div className="w-8/9 flex flex-col justify-center items-center text-center gap-[43.53px] mt-[30.84px] md:w-9/10 max-w-7xl">
          <p className="text-5xl leading-normal font-bold">
            Ready to start your project?
          </p>
          <Button
            text="Create an account"
            className="transition ease-in-out text-lg leading-none font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
            padding="py-4 px-[52px]"
            onClick={() => createAccount("Build-Welcome: Create project - bottom")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
