import Image from "next/image";

import info from "@/assets/info.svg"

const CheckoutSuccess = () => {
  return (
    <div className="flex flex-row md:flex-col items-center md:text-center gap-7 md:gap-2 bg-success rounded-[20px] px-[30px] py-[18px] border-[0.5px] border-star-dust-alpha-70">
      <Image
        src={info}
        alt="info"
        width={32}
        height={32}
      />
      <p className="font-medium">
        Congratulations! Your operator account Basic plan is active
      </p>
    </div>
  )
}

export default CheckoutSuccess;
