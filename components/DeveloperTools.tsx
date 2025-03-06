import Image from 'next/image';

import faucet from '@/assets/faucet.svg';
import fusebox from '@/assets/fusebox.svg';
import mobileSdk from '@/assets/mobile-sdk.svg';
import webSdk from '@/assets/web-sdk.svg';

const DeveloperTools = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-5">
      <h2 className="text-[2.5rem] md:text-3xl leading-tight text-fuse-black font-semibold">
        Developer tools
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-1 gap-[30px] md:gap-5">
        <a
          href="https://docs.fuse.io/developers/fusebox/sdk/installation-and-setup?platform=flutter"
          target="_blank"
          className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
        >
          <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[159px]">
            <p className="text-[20px]/7 text-fuse-black font-bold">
              Mobile SDK
            </p>
            <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
              Build Smart Contract Wallets with Flutter SDK
            </p>
            <Image
              src={mobileSdk}
              alt="mobile sdk"
              width={80}
              height={80}
            />
          </div>
        </a>
        <a
          href="https://docs.fuse.io/developers/fusebox/sdk/installation-and-setup?platform=web"
          target="_blank"
          className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
        >
          <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[152px]">
            <p className="text-[20px]/7 text-fuse-black font-bold">
              Web SDK
            </p>
            <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
              Easy way to Account Abstraction using JS SDK
            </p>
            <Image
              src={webSdk}
              alt="Fuse connect"
              width={92}
              height={65}
            />
          </div>
        </a>
        <a
          href="https://stakely.io/en/faucet/fuse-fuse"
          target="_blank"
          className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
        >
          <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[152px]">
            <p className="text-[20px]/7 text-fuse-black font-bold">
              Fuse Faucet
            </p>
            <p className="text-sm text-text-dark-gray text-center max-w-[201.78px]">
              Get free FUSE for tests
            </p>
            <Image
              src={faucet}
              alt="faucet"
              width={62}
              height={91}
            />
          </div>
        </a>
        <a
          href="https://docs.fuse.io/developers/fusebox/"
          target="_blank"
          className="transition ease-in-out flex justify-between items-center bg-lightest-gray hover:bg-success rounded-[20px] p-2 min-h-[220px]"
        >
          <div className="flex flex-col justify-between items-center m-auto max-w-[215px] min-h-[152px]">
            <p className="text-[20px]/7 text-fuse-black font-bold">
              FuseBox
            </p>
            <p className="text-sm text-text-dark-gray text-center max-w-[213.4px]">
              Discover Fuse middleware APIs
            </p>
            <Image
              src={fusebox}
              alt="Fusebox"
              width={70}
              height={81}
            />
          </div>
        </a>
      </div>
    </div>
  )
};

export default DeveloperTools;
