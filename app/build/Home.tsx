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
import { buildSubMenuItems } from "@/lib/helpers";
import * as amplitude from "@amplitude/analytics-browser";

const apps = [
  {
    name: "Request Finance",
    description: "A decentralized protocol that allows for efficient crypto payments",
    logo: requestFinance,
    link: "https://www.fuse.io/ecosystem-project/request-finance"
  },
  {
    name: "Transak",
    description: "Developer integration toolkit powering the best in Web3 payments",
    logo: transak,
    link: "https://www.fuse.io/ecosystem-project/transak"
  },
  {
    name: "ThirdWeb",
    description: "ThirdWeb provides a complete set of tools for building Web3 applications",
    logo: thirdweb,
    link: "https://www.fuse.io/ecosystem-project/thirdweb"
  },
  {
    name: "Cointool",
    description: "Multichain digital currency toolbox facilitating Web3 development",
    logo: cointool,
    link: "https://www.fuse.io/ecosystem-project/cointool"
  },
  {
    name: "The Graph",
    description: "Indexing protocol securing users' access to blockchain data via GraphQL",
    logo: theGraph,
    link: "https://www.fuse.io/ecosystem-project/the-graph"
  },
  {
    name: "TaskOn",
    description: "TaskOn is a Web3 Collaboration Platform that brings users a deep Web3 experience, including reward campaigns, first-hand information on Web3 projects, and more.",
    logo: taskOn,
    link: "https://www.fuse.io/ecosystem-project/taskon"
  },
]

const Home = () => {
  const router = useRouter();

  function createAccount(eventInput: string) {
    amplitude.track(eventInput);
    router.push("/dashboard");
  }

  return (
    <div className="w-full bg-light-gray">
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col mt-[30.84px] md:w-9/10 max-w-7xl">
          <NavMenu menuItems={buildSubMenuItems} isOpen={true} selected="welcome" className="" liClassName="w-28" />
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col mt-[76.29px] md:w-9/10 max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-[70px]/[84.35px] text-fuse-black font-semibold max-w-[729.99px] mt-[13.98px] mb-[22px]">
              Build your Web3 Project with Fuse
            </h1>
            <p className="text-[20px]/7 text-text-dark-gray mb-[50.52px] max-w-[395.25px]">
              A one-stop-shop for everything you need to get your dApp up and running
            </p>
            <Button
              text="Create your project"
              className="transition ease-in-out text-lg font-semibold bg-pale-green rounded-full hover:bg-white"
              padding="py-4 px-[52px]"
              onClick={() => createAccount("Build-Welcome: Create project - upper")}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
          <div className="flex flex-row md:flex-col justify-center gap-[31px] mt-[117.5px] mb-[119px]">
            <div className="bg-white rounded-[20px] p-[51px] md:px-4 md:py-6 w-full max-w-[623px] h-[800px] bg-[url('/vectors/get-mobiles.svg')] bg-no-repeat bg-bottom">
              <p className="text-[34px] text-fuse-black font-bold">
                Get started
              </p>
              <p className="text-[20px]/7 text-text-dark-gray mt-[30.61px] mb-[38.67px] max-w-[395.25px]">
                Start building your project - no crypto expertise are needed
              </p>
              <div className="rounded-[20px] pt-[35.4px] px-10 pb-[50px] md:px-3 md:py-4">
                <div className="flex flex-col gap-[25.79px]">
                  <p className="text-[50px] text-fuse-black font-bold">
                    $0
                  </p>
                  <div className="flex flex-col gap-[18.73px]">
                    <div className="flex items-center gap-[13.3px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-xl font-bold">
                        1M RPC calls a day
                      </p>
                    </div>
                    <div className="flex items-center gap-[13.3px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-xl font-bold">
                        10K FuseBox transactions a day
                      </p>
                    </div>
                    <div className="flex items-center gap-[13.3px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-xl font-bold">
                        1M FuseBox API calls a day
                      </p>
                    </div>
                    <div className="flex items-center gap-[13.3px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-xl font-bold">
                        1M Subgraph calls a day
                      </p>
                    </div>
                    <div className="flex items-center gap-[13.3px]">
                      <Image
                        src={checkmarkBg}
                        alt="checkmark with background"
                      />
                      <p className="text-xl font-bold">
                        10K Webhook call
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[30px] w-[626px] md:w-auto">
              <div className="bg-white rounded-[20px] pt-[50px] px-[47.5px] md:px-4 md:py-6 h-[385px] md:h-auto bg-[url('/vectors/create-mobiles.svg')] md:bg-none bg-no-repeat bg-bottom">
                <p className="text-[34px]/[40.97px] text-fuse-black font-bold max-w-[473.16px]">
                  Create programable wallets for your customers
                </p>
                <p className="text-[20px]/7 text-text-dark-gray mt-[12.98px] max-w-[352.54px]">
                  Create a wallet for your customers with fast time to market
                </p>
              </div>
              <div className="bg-white rounded-[20px] pt-[50px] px-[47.5px] md:px-4 md:py-6 h-[385px] md:h-auto">
                <p className="text-[34px]/[40.97px] text-fuse-black font-bold">
                  Mobile and Web SDK&apos;s
                </p>
                <p className="text-xl text-text-dark-gray mt-[12.98px] mb-[25.31px]">
                  Account abstraction straight from the box:
                </p>
                <div className="flex flex-col gap-[18.73px]">
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray">
                      Social logins
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray">
                      Gasless transactions
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray">
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
          <div className="flex flex-col gap-28">
            <div className="flex justify-center text-center">
              <p className="text-[34px]/[50.32px] font-bold max-w-[688.35px]">
                Onboard your users to web3 with a cost structure that makes sense
              </p>
            </div>
            <div className="flex flex-row md:flex-col gap-[85.15px] px-[54.46px] py-[53.36px] md:px-4 md:py-6 h-[618px] md:h-auto bg-white rounded-[20px] bg-[url('/vectors/ecosystem.svg')] md:bg-none bg-no-repeat bg-right-bottom">
              <div>
                <p className="text-[34px]/[40.97px] text-fuse-black font-bold">
                  An ecosystem for web3 payments
                </p>
                <p className="text-xl text-text-dark-gray mt-[32.14px] mb-[90.51px] max-w-[395.25px]">
                  Fuse Operator account gives you access to a one stop shop of
                  value add services. All accessible trough one simple pricing.
                </p>
                <div className="flex flex-col gap-[18.73px]">
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray font-bold">
                      KYC and fiat on/off-ramping
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray font-bold">
                      Recurring payments - coming soon
                    </p>
                  </div>
                  <div className="flex items-center gap-[13.3px]">
                    <Image
                      src={checkmarkBg}
                      alt="checkmark with background"
                    />
                    <p className="text-xl text-text-dark-gray font-bold">
                      Private business transactions - coming soon
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[18.73px]">
                <div className="flex items-center gap-[13.3px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-xl text-text-dark-gray font-bold">
                    Most reliable business stack in web3
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-xl text-text-dark-gray font-bold">
                    Pay as you go only if you have traction
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-xl text-text-dark-gray font-bold">
                    High availability for real time payments
                  </p>
                </div>
                <div className="flex items-center gap-[13.3px]">
                  <Image
                    src={checkmarkBg}
                    alt="checkmark with background"
                  />
                  <p className="text-xl text-text-dark-gray font-bold">
                    Fault tolerance - build once and scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-fuse-black pt-[122.6px] pb-[147px] mt-[368px] mb-[169.47px] bg-[url('/vectors/pluses.svg')]">
        <div className="w-full flex flex-col items-center">
          <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
            <div className="flex flex-col gap-[91px]">
              <div className="flex flex-col items-center text-center gap-[22px]">
                <p className="text-[40px]/[48.2px] text-white font-bold">
                  Explore our Apps & Services
                </p>
                <p className="text-[20px]/7 text-white max-w-[756.49px]">
                  Simplify your work using trusted out of the box third-party solutions available
                  on the Fuse Network. Explore and connect the services that your business requires.
                </p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-1 justify-between gap-[30px]">
                {apps.map((app, i) =>
                  <a
                    key={i}
                    href={app.link}
                    target="_blank"
                    className="flex flex-col gap-2.5 justify-between min-h-[269px] px-[30px] py-7 md:px-4 md:py-6 bg-white/5 hover:bg-white/10 rounded-[20px]"
                  >
                    <div>
                      <p className="text-white font-semibold">
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
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col justify-center items-center text-center gap-[13.25px]">
              <p className="text-3xl text-fuse-black font-semibold">
                Plans & Pricing
              </p>
              <p className="text-[20px]/7 leading-[21.69px] text-text-dark-gray">
                Here is the list of the Fuse products and solutions
              </p>
            </div>
            <div className="flex flex-row lg:flex-col lg:items-center justify-center gap-[30px]">
              <div className="flex flex-col gap-[30px] rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <p className="text-3xl text-fuse-black font-semibold">
                    Starter plan
                  </p>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px] max-w-[300px]">
                    Unleash the power of your buissiness with the starter plan
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
                      1M RPC calls a day
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
                      10K FuseBox transactions a day
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
                      1M FuseBox API calls a day
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
                      1M Subgraph calls a day
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
                      10K Webhook call
                    </p>
                  </div>
                </div>
                <Button
                  text="Get Started"
                  className="transition ease-in-out text-lg text-white font-semibold bg-black rounded-full hover:bg-white hover:text-black"
                  padding="py-4 px-[52px] mt-[25.88px]"
                  onClick={() => createAccount("Get started: Starter")}
                />
              </div>
              <div className="flex flex-col gap-[30px] bg-white rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <div className="flex items-center gap-[13.46px]">
                    <p className="text-3xl text-fuse-black font-semibold">
                      Pro plan
                    </p>
                    <div className="border border-2 rounded-full px-3 py-1.5">
                      <p className="text-base leading-none font-semibold">
                        Popular
                      </p>
                    </div>
                  </div>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px] max-w-[300px]">
                    Unleash the power of your buissiness with the starter plan
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
                <div className="flex flex-col gap-4 h-[200px] md:h-auto">
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
                <Button
                  text="Get Started"
                  className="transition ease-in-out text-lg text-white font-semibold bg-black rounded-full hover:bg-success hover:text-black"
                  padding="py-4 px-[52px] mt-[25.88px]"
                  onClick={() => createAccount("Get started: Pro")}
                />
              </div>
              <div className="flex flex-col gap-[30px] rounded-[20px] px-10 pt-11 pb-[52.88px] max-w-[406px]">
                <div className="h-[194px] md:h-auto">
                  <p className="text-3xl text-fuse-black font-semibold">
                    Advanced plan
                  </p>
                  <p className="text-night opacity-60 mt-[18.82px] mb-[30.7px]">
                    Unleash the power of your buissiness with the starter plan
                  </p>
                  <div className="flex items-baseline gap-[10.63px]">
                    <p className="text-3xl text-ghost font-semibold">
                      Coming soon
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
                <Button
                  text="Coming soon"
                  className="text-lg text-white font-semibold bg-iron rounded-full"
                  padding="py-4 px-[52px] mt-[25.88px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-[169.47px] mb-[187px]">
        <div className="w-8/9 flex flex-col justify-center items-center text-center gap-[43.53px] mt-[30.84px] md:w-9/10 max-w-7xl">
          <p className="text-5xl leading-normal font-bold">
            Ready to start your project?
          </p>
          <Button
            text="Create an account"
            className="transition ease-in-out text-lg font-semibold bg-pale-green rounded-full hover:bg-black hover:text-white"
            padding="py-4 px-[52px]"
            onClick={() => createAccount("Build-Welcome: Create project - bottom")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
