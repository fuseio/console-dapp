import Button from "@/components/ui/Button";
import Image from "next/image";
import checkmark from "@/assets/checkmark.svg"
import requestFinance from "@/public/request-finance.png"
import transak from "@/public/transak.png"
import thirdweb from "@/public/thirdweb.png"
import cointool from "@/public/cointool.png"
import theGraph from "@/public/the-graph.png"
import taskOn from "@/public/taskon.png"
import { useRouter } from "next/navigation";
import { cn, path } from "@/lib/helpers";
import { useAppSelector } from "@/store/store";
import { selectOperatorSlice } from "@/store/operatorSlice";
import walletModal from "@/assets/wallet-modal.svg"
import contract from "@/assets/contract.svg"
import dollarBorder from "@/assets/dollar-border.svg"
import wallet from "@/assets/wallet.svg"
import cart from "@/assets/cart.svg"
import zap from "@/assets/zap.svg"
import currencyExchange from "@/assets/currency-exchange.svg"
import automation from "@/assets/automation.svg"
import shield from "@/assets/shield.svg"
import dollarLineBorder from "@/assets/dollar-line-border.svg"
import verified from "@/assets/verified.svg"
import parachute from "@/assets/parachute.svg"
import starBorder from "@/assets/star-border.svg"
import block from "@/assets/block.svg"
import Link from "next/link";
import EdisonBanner from "@/components/build/EdisonBanner";

const apps = [
  {
    title: "Create an invoice",
    description: "A decentralized protocol that allows for efficient crypto payments",
    logo: requestFinance,
    link: "https://www.fuse.io/ecosystem-project/request-finance",
    name: "Request",
    tag: "Web3 Payments"
  },
  {
    title: "Onramp from your bank",
    description: "Developer integration toolkit powering the best in Web3 payments",
    logo: transak,
    link: "https://www.fuse.io/ecosystem-project/transak",
    name: "Transak",
    tag: "Fiat On-Ramp"
  },
  {
    title: "Deploy a contract",
    description: "ThirdWeb provides a complete set of tools for building Web3 applications",
    logo: thirdweb,
    link: "https://www.fuse.io/ecosystem-project/thirdweb",
    name: "ThirdWeb",
    tag: "Infra"
  },
  {
    title: "Create a token",
    description: "Multichain digital currency toolbox facilitating Web3 development",
    logo: cointool,
    link: "https://www.fuse.io/ecosystem-project/cointool",
    name: "CoinTool",
    tag: "Dev tools"
  },
  {
    title: "Deploy a subgraph",
    description: "Indexing protocol securing users' access to blockchain data via GraphQL",
    logo: theGraph,
    link: "https://www.fuse.io/ecosystem-project/the-graph",
    name: "The Graph",
    tag: "Indexing"
  },
  {
    title: "Create an air drop campaign",
    description: "TaskOn is a Web3 Collaboration Platform offering rewards, exclusive Web3 project insights, and more.",
    logo: taskOn,
    link: "https://www.fuse.io/ecosystem-project/taskon",
    name: "TaskOn",
    tag: "Community"
  },
]

const fuseboxPills = [
  "Wallet",
  "Account abstraction",
  "Flutter SDK",
  "ERC4337",
  "Dedicated RPCs",
  "Webhooks",
  "Subgraphs"
]

const fuseboxFeatures = [
  {
    name: "Deploy contracts",
    description: "Abstract away complexity Simplify user onboarding and transactions",
    image: {
      src: contract,
      width: 20,
      height: 20
    }
  },
  {
    name: "Branded stablecoins",
    description: "Index and query blockchain data Build powerful dApp experiences",
    image: {
      src: dollarBorder,
      width: 40,
      height: 20
    }
  },
  {
    name: "Wallet as a service",
    description: "Deploy smart contracts with ease Monitor and manage deployments",
    image: {
      src: wallet,
      width: 40,
      height: 40
    }
  },
  {
    name: "Online commerce",
    description: "Private nodes for your dApp Fast and reliable connectivity",
    image: {
      src: cart,
      width: 29,
      height: 29
    },
    classNames: {
      description: "max-w-52"
    }
  },
  {
    name: "Loyalty programs",
    description: "Launch your own stablecoin Full control over token operations",
    image: {
      src: zap,
      width: 22,
      height: 32
    }
  },
  {
    name: "Composable yield",
    description: "Account abstraction standard Better UX for web3 users",
    image: {
      src: currencyExchange,
      width: 40,
      height: 40
    },
    classNames: {
      description: "max-w-52"
    }
  },
  {
    name: "Automations",
    description: "Design token distributions Execute airdrops at scale",
    image: {
      src: automation,
      width: 36,
      height: 34
    }
  },
  {
    name: "Security & Cost cutting",
    description: "Track on-chain events Get real-time notifications",
    image: {
      src: shield,
      width: 28,
      height: 35
    },
    classNames: {
      description: "max-w-52"
    }
  }
]

const edisonFeatures = [
  {
    name: "Mint a branded Stablecoin",
    description: "Create your own price-stable token on Fuse",
    image: {
      src: dollarLineBorder,
      width: 40,
      height: 40
    },
    classNames: {
      description: "max-w-52"
    }
  },
  {
    name: "Create a payment link",
    description: "Accept crypto payments with simple links",
    image: {
      src: verified,
      width: 40,
      height: 40
    },
    classNames: {
      description: "max-w-52"
    }
  },
  {
    name: "Create an Airdrop",
    description: "Distribute tokens to your community easily",
    image: {
      src: parachute,
      width: 40,
      height: 40
    },
    classNames: {
      description: "max-w-52"
    }
  },
  {
    name: "Research a token",
    description: "Get insights on any token on the Fuse ecosystem",
    image: {
      src: starBorder,
      width: 40,
      height: 40
    },
    classNames: {
      description: "max-w-52"
    }
  }
]

const Home = () => {
  const router = useRouter();
  const operatorSlice = useAppSelector(selectOperatorSlice);

  function createAccount() {
    router.push(operatorSlice.isAuthenticated ? path.DASHBOARD : path.BUILD_REGISTER);
  }

  return (
    <div className="w-full bg-light-gray">
      <div className="w-full flex flex-col items-center">
        <div className="w-8/9 flex flex-col py-20 md:py-16 md:w-9/10 max-w-7xl">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-[70px] md:text-[32px] leading-tight text-fuse-black font-semibold max-w-[729.99px] mt-[13.98px] mb-[22px]">
              Connect your Business to Web3
            </h1>
            <p className="text-[20px]/7 text-text-dark-gray mb-[50.52px] md:mb-[18px]">
              Our AI agent Edison will help you build your idea from A to Z
            </p>
            <Button
              text="Start building"
              className="transition ease-in-out text-lg leading-none font-semibold bg-pale-green rounded-full hover:bg-white"
              padding="py-4 px-[52px]"
              onClick={() => createAccount()}
            />
          </div>
        </div>
      </div>
      <section className="w-8/9 flex flex-col gap-10 md:w-9/10 max-w-7xl mx-auto py-20 md:py-16">
        <article className="grid grid-cols-2 gap-10 bg-lightest-gray rounded-[20px] p-10 lg:grid-cols-1">
          <div className="flex flex-col items-start gap-8">
            <div className="text-[2.125rem] text-text-dark-gray md:text-lg">
              FuseBox
            </div>
            <h2 className="text-6xl text-fuse-black font-semibold md:text-2xl">
              Client SDKs to connect users to web3
            </h2>
            <p className="text-[1.25rem] text-text-dark-gray md:text-base">
              Unleash the power of Fusebox our middleware for Account abstraction using Edison you can onboard your customers to web3 with very little coding knowledge
            </p>
            <div className="flex flex-wrap gap-2.5">
              {fuseboxPills.map((pill, i) => (
                <div key={i} className="border border-text-dark-gray rounded-full px-4 py-2 text-lg text-text-dark-gray leading-none md:text-sm">
                  {pill}
                </div>
              ))}
            </div>
            <button
              className="transition ease-in-out px-10 py-4 bg-fuse-black border border-fuse-black rounded-full text-lg leading-none text-white font-semibold hover:bg-[transparent] hover:text-fuse-black"
              onClick={() => createAccount()}
            >
              Start building
            </button>
          </div>
          <Image src={walletModal} alt="wallet modal" width={510} height={510} />
        </article>
        <div className="grid grid-cols-4 gap-10 lg:grid-cols-2 md:grid-cols-1">
          {fuseboxFeatures.map((feature, i) => (
            <article key={i} className="flex flex-col items-start gap-3 bg-white rounded-[20px] p-5">
              <div className="flex items-center w-10 h-10">
                <Image src={feature.image.src} alt={feature.name} width={feature.image.width} height={feature.image.height} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[1.25rem] font-semibold">
                  {feature.name}
                </p>
                <p className={cn("text-sm text-text-dark-gray", feature.classNames?.description)}>
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="w-8/9 flex flex-col gap-10 md:w-9/10 max-w-7xl mx-auto py-28 md:py-16">
        <EdisonBanner />
        <div className="grid grid-cols-4 gap-10 lg:grid-cols-2 md:grid-cols-1">
          {edisonFeatures.map((feature, i) => (
            <article key={i} className="flex flex-col items-start gap-3 bg-white rounded-[20px] p-5 pr-4">
              <div className="flex items-center w-10 h-10">
                <Image src={feature.image.src} alt={feature.name} width={feature.image.width} height={feature.image.height} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[1.25rem] font-semibold">
                  {feature.name}
                </p>
                <p className={cn("text-sm text-text-dark-gray", feature.classNames?.description)}>
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="w-full py-28 bg-white text-dune md:py-16">
        <div className="w-8/9 flex flex-col md:w-9/10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-[91px] md:gap-[52px]">
            <div className="flex flex-col items-center text-center gap-[22px]">
              <h2 className="text-5xl md:text-2xl md:leading-tight font-semibold">
                Explore our Apps & Services
              </h2>
              <p className="text-[20px]/7 md:text-base max-w-[756.49px] md:max-w-[347.38px]">
                Save months for building your wallet app with reliable, ready-to-use third-party solutions on Fuse Network. Integrate the services your business needs to save development time and costs.
              </p>
            </div>
            <div className="grid grid-cols-6 lg:grid-cols-3 md:grid-cols-1 gap-5">
              {apps.map((app, i) =>
                <Link
                  key={i}
                  href={app.link}
                  target="_blank"
                  className="flex flex-col gap-2.5 p-3 hover:bg-black/5 rounded-[20px]"
                >
                  <Image
                    src={app.logo}
                    alt={app.name}
                  />
                  <div className="flex flex-col items-start gap-1.5">
                    <p className="text-2xl font-semibold">
                      {app.name}
                    </p>
                    <div className="bg-dune/10 rounded-full px-3.5 py-2 leading-none">
                      {app.tag}
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div className="flex justify-center">
              <Link
                href="https://www.fuse.io/ecosystem"
                target="_blank"
                className="transition ease-in-out px-10 py-4 bg-fuse-black border border-fuse-black rounded-full text-lg leading-none text-white font-semibold hover:bg-[transparent] hover:text-fuse-black"
              >
                Explore our ecosystem
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-8/9 flex flex-col gap-10 md:w-9/10 max-w-7xl mx-auto py-28 md:py-16">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col justify-center items-center text-center gap-[13.25px]">
            <h2 className="text-5xl md:text-[32px] md:leading-tight text-fuse-black font-semibold">
              Plans & Pricing
            </h2>
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
              <div className="flex flex-col gap-4 h-[250px] md:h-auto">
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
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    50 Edison AI prompts
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
                    10K RPC calls
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
                    10K API calls
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
                    10K Webhook calls
                  </p>
                </div>
              </div>
              <Button
                text="Get Started"
                className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black rounded-full hover:bg-white hover:text-black"
                padding="py-4 px-[52px] mt-[25.88px]"
                onClick={() => createAccount()}
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
              <div className="flex flex-col gap-4 h-[250px] md:h-auto">
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
                    Up to 1000 Edison AI prompts
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
                    1M RPC calls
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
                <div className="flex items-center gap-[13.98px]">
                  <Image
                    src={checkmark}
                    alt="checkmark"
                    width={15.64}
                    height={10.5}
                  />
                  <p>
                    1M Webhook calls
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
                onClick={() => createAccount()}
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
              <div className="flex flex-col gap-4 h-[250px] md:h-auto">
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
                    Unlimited Edison AI agent
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
                    Unlimited RPC calls
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
                    Unlimited API calls
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
                    Unlimited Webhook calls
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
      </section>
      <section className="w-full py-28 bg-success text-center md:py-16">
        <div className="w-8/9 flex flex-col justify-center items-center gap-5 md:w-9/10 max-w-7xl mx-auto">
          <Image src={block} alt="block" width={121} height={140} />
          <h2 className="text-6xl leading-tight font-semibold max-w-xl md:text-2xl">
            Ready to start building for Web3?
          </h2>
          <p className="text-[1.25rem] text-text-dark-gray font-medium">
            Start using FuseBox today
          </p>
          <button
            className="transition ease-in-out px-10 py-4 bg-fuse-black border border-fuse-black rounded-full text-lg leading-none text-white font-semibold hover:bg-[transparent] hover:text-fuse-black"
            onClick={() => createAccount()}
          >
            Get started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
