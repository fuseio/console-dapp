import Image from "next/image"
import developerDocumentation from "@/assets/developer-documentation.svg";
import getSupport from "@/assets/get-support.svg";

const DocumentSupport = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-[30px] divide-x-[1px] lg:divide-x-0 lg:divide-y-[1px] divide-gray-goose">
      <div className="transition ease-in-out flex flex-row md:flex-col md:gap-8 justify-between pt-[36px] pr-[51px] pb-[30px] pl-14 md:px-4 md:py-6 min-h-[174px]">
        <div className="flex flex-col justify-center items-start">
          <p className="text-2xl text-fuse-black font-bold">
            Developer Documentation
          </p>
          <p className="text-text-dark-gray max-w-[210px] mt-[9.83px] mb-[17.06px]">
            Find resources that help you to build on Fuse
          </p>
          <a
            href="https://docs.fuse.io/"
            target="_blank"
            className="text-lg leading-none text-white font-semibold rounded-full bg-black px-5 py-[11.5px]"
          >
            Read the Docs
          </a>
        </div>
        <Image
          src={developerDocumentation}
          alt="developer documentation"
          width={155}
          height={140}
          className="md:m-auto"
        />
      </div>
      <div className="transition ease-in-out flex flex-row md:flex-col md:gap-8 justify-between pt-[36px] pr-[51px] pb-[30px] pl-14 md:px-4 md:py-6 min-h-[174px]">
        <div className="flex flex-col justify-center items-start">
          <p className="text-2xl text-fuse-black font-bold">
            Get Support
          </p>
          <p className="text-text-dark-gray max-w-[210px] mt-[9.83px] mb-[17.06px]">
            Feel free to ask questions on our{" "}
            <a
              href="https://discord.com/invite/jpPMeSZ"
              target="_blank"
              className="underline"
            >
              Discord
            </a>{" "}
            channel
          </p>
          <a
            href="mailto:console@fuse.io"
            className="text-lg leading-none text-white font-semibold rounded-full bg-black px-5 py-[11.5px]"
          >
            Get Support
          </a>
        </div>
        <Image
          src={getSupport}
          alt="get support"
          width={213}
          height={138}
          className="md:m-auto"
        />
      </div>
    </div>
  )
}

export default DocumentSupport
