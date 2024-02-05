import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";

type CopyProps = {
  src: string | StaticImport;
  text: string;
  tooltipText?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const Copy = ({
  src,
  text,
  tooltipText = "Address copied",
  alt = "copy address",
  className = "cursor-pointer",
  width = 18,
  height = 18
}: CopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const oneSecondInMillisecond = 1000;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, oneSecondInMillisecond);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [isCopied])

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  }

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onClick={handleCopy}
      />
      <div className={`copy-tooltip absolute left-1/2 -translate-x-1/2 top-8 bg-black px-[13.4px] py-[7.56px] rounded-2xl w-max shadow-lg text-white text-sm leading-none font-medium ${isCopied ? "block" : "hidden"}`}>
        <p>
          {tooltipText}
        </p>
      </div>
    </div>
  )
}

export default Copy;
