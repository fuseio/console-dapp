import Image from "next/image";

import info from "@/assets/info.svg"
import Button from "../ui/Button";

type OperatorNoticeProps = {
  title: string;
  onClick: () => void;
}

const OperatorNotice = ({ title, onClick }: OperatorNoticeProps) => {
  return (
    <div className="flex flex-row md:flex-col gap-4 justify-between items-center bg-lemon-chiffon rounded-[20px] px-[30px] py-[18px] border-[0.5px] border-star-dust-alpha-70">
      <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2">
        <Image
          src={info}
          alt="info"
          width={32}
          height={32}
        />
        <p className="font-medium">
          {title}
        </p>
      </div>
      <Button
        text="Upgrade"
        className="transition ease-in-out text-lg leading-none text-white font-semibold bg-black hover:text-black hover:bg-white rounded-full"
        padding="py-3.5 px-[38px]"
        onClick={onClick}
      />
    </div>
  )
}

export default OperatorNotice;
