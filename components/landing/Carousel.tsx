import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import * as amplitude from "@amplitude/analytics-browser";

import 'swiper/css';
import 'swiper/css/navigation';

import rightArrow from "@/assets/right-arrow.svg";
import edison from "@/assets/edison.svg";
import edisonChat from "@/assets/edison-chat.svg";

const OperatorSlide = () => {
  return (
    <div className="transition-all ease-in-out bg-lightest-gray hover:bg-success rounded-[20px] md:min-h-[514px] px-[83.31px] pt-[60.36px] pb-[67px] md:px-[31px] md:py-[30px] bg-[url('/vectors/build-mobiles.svg')] hover:bg-[url('/vectors/build-mobiles-white.svg')] bg-no-repeat bg-bottom">
      <p className="text-[40px] md:text-[32px] leading-tight text-fuse-black font-semibold max-w-[414.86px]">
        Build your Web3 project with Fuse
      </p>
      <p className="text-[20px]/7 text-text-dark-gray md:text-base max-w-[395.25px] mt-[15.42px] mb-[35.58px]">
        Easily access affordable Web3 payment & loyalty infrastructure
        without development hurdles or vendor dependencies.
      </p>
      <Link
        href="/build"
        className="transition ease-in-out md:block md:text-center text-lg leading-none text-white hover:text-black font-semibold bg-black hover:bg-white rounded-full py-4 px-[52px] md:px-2 md:w-11/12 md:max-w-[270px]"
        onClick={() => amplitude.track("Home: Create project")}
      >
        Create your project
      </Link>
    </div>
  )
}

const EdisonSlide = () => {
  return (
    <div className='bg-lightest-gray rounded-[20px] px-14 py-4 md:px-8 h-full flex md:flex-col justify-between items-center'>
      <div className="flex flex-col justify-center items-start">
        <div className='flex items-center gap-0.5'>
          <p className='text-[70px] md:text-[32px] leading-tight'>
            Meet
          </p>
          <Image src={edison} alt="edison" width={304} height={73} className='md:hidden' />
          <Image src={edison} alt="edison" width={150} height={50} className='hidden md:block' />
        </div>
        <p className='text-[20px]/7 text-text-dark-gray md:text-base max-w-[550px]'>
          Experience the power of blockchain without the complexity. Ask the Fuse AI Agent to handle your Fuse Network transactions, manage assets, and navigate DeFi services.
        </p>
        <Link
          href="https://www.fuse.io/edison"
          target='_blank'
          className="transition ease-in-out text-center text-lg leading-none text-white hover:text-black font-semibold bg-black hover:bg-[transparent] border border-black rounded-full py-4 px-[52px] md:py-3 mt-10 md:mt-4 md:px-2 md:w-11/12 md:max-w-[270px]"
          onClick={() => amplitude.track("Home: Edison")}
        >
          Join the waitlist
        </Link>
      </div>
      <Image src={edisonChat} alt="edison chat" width={500} height={500} />
    </div>
  )
}

const Carousel = () => {
  return (
    <div className='relative mt-[99.5px] mb-10 md:mt-[78px] md:mb-5'>
      <button className='carousel-prev-button absolute top-1/2 -left-10 translate-y-1/2 rotate-180 hover:opacity-50'>
        <Image src={rightArrow} alt="previous slide" width={24} height={24} />
      </button>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: '.carousel-prev-button',
          nextEl: '.carousel-next-button'
        }}
        className='w-full h-full'
      >
        <SwiperSlide>
          <OperatorSlide />
        </SwiperSlide>
        <SwiperSlide>
          <EdisonSlide />
        </SwiperSlide>
      </Swiper>
      <button className='carousel-next-button absolute top-1/2 -right-10 translate-y-1/2 hover:opacity-50'>
        <Image src={rightArrow} alt="next slide" width={24} height={24} />
      </button>
    </div>
  );
};

export default Carousel;
