import { useAppSelector } from "@/store/store";
import { selectAirdropSlice } from "@/store/airdropSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import { daysInYear, eclipseAddress } from "@/lib/helpers";
import Avatar from "@/components/ui/Avatar";

import crown from "@/assets/crown.svg";
import star from "@/assets/star.svg";
import starGold from "@/assets/star-gold.svg";
import starSilver from "@/assets/star-silver.svg";
import starBronze from "@/assets/star-bronze.svg";

type PositionStar = {
  name: string;
  icon: string;
}

type PositionStars = {
  [key: number]: PositionStar
}

const leaderboardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { ease: [0.78, 0.14, 0.15, 0.86] }
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.78, 0.14, 0.15, 0.86] },
  }
};

const positionStars: PositionStars = {
  1: {
    name: "Gold",
    icon: starGold
  },
  2: {
    name: "Silver",
    icon: starSilver
  },
  3: {
    name: "Bronze",
    icon: starBronze
  }
}

const Home = () => {
  const { leaderboardUsers, user } = useAppSelector(selectAirdropSlice);

  return (
    <div className="w-8/9 flex flex-col text-fuse-black my-16 xl:my-14 xl:w-9/12 md:w-9/10 max-w-7xl">
      <h1 className="text-5xl xl:text-3xl font-semibold">
        Leaderboard
      </h1>
      <p className="text-lg xl:text-base font-semibold mb-4 mt-16 xl:mb-2.5">
        Your Ranking
      </p>
      <motion.div
        key="userLeaderboard"
        variants={leaderboardVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-[20px] flex items-center gap-2.5 xl:gap-2 text-lg font-medium pl-2.5 py-[22px] pr-10 xl:pl-2 xl:py-4 xl:pr-8"
      >
        <div className="w-[87px] xl:w-[70px] flex justify-center">
          <p className="bg-white/10 rounded-full xl:text-sm leading-none px-2.5 py-[6.5px] xl:px-2 xl:py-1">
            {new Intl.NumberFormat().format(user.leaderboardPosition)}
          </p>
        </div>
        <div className="flex items-center pl-2.5 pr-7 xl:pl-2 xl:pr-4">
          <Avatar size={40} />
        </div>
        <div className="grow md:w-8/12">
          <p className="hidden md:block xl:text-sm">
            {eclipseAddress(user.walletAddress)}
          </p>
          <p className="md:hidden xl:text-sm">
            {user.walletAddress}
          </p>
        </div>
        <div className="flex gap-[7px] xl:gap-1 text-right">
          <Image
            src={star}
            alt="star"
            width={20}
            height={20}
          />
          <p className="xl:text-sm">
            {user.points % 1 === 0 ? user.points : user.points.toFixed(2)}
          </p>
        </div>
      </motion.div>
      <p className="text-lg xl:text-base font-semibold mt-10 mb-4 xl:mt-8 xl:mb-2.5">
        Top users of all-time
      </p>
      <div className="flex flex-col gap-2.5 xl:gap-2">
        {leaderboardUsers.map((leaderboardUser, index) =>
          <motion.div
            key={leaderboardUser.id}
            variants={leaderboardVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-[20px] flex items-center gap-2.5 xl:gap-2 text-lg xl:text-base font-medium  pl-2.5 py-[22px] pr-10 xl:pl-2 xl:py-4 xl:pr-8"
          >
            <div className="w-[87px] xl:w-[70px] flex justify-center items-center relative">
              {positionStars[index + 1] &&
                <Image
                  src={positionStars[index + 1].icon}
                  alt={positionStars[index + 1].name}
                  width={36}
                  height={36}
                />
              }
              <p className="absolute top-[55%] -translate-y-1/2 xl:text-sm leading-none">
                {new Intl.NumberFormat().format(index + 1)}
              </p>
            </div>
            <div className="flex items-center pl-2.5 pr-7 xl:pl-2 xl:pr-4">
              <Avatar size={40} />
            </div>
            <div className="grow flex flex-row items-center gap-9 xl:gap-4 md:w-8/12">
              <p className="md:hidden xl:text-sm">
                {leaderboardUser.walletAddress}
              </p>
              <p className="hidden md:block xl:text-sm">
                {eclipseAddress(leaderboardUser.walletAddress)}
              </p>
              {(leaderboardUser.walletAgeInDays && leaderboardUser.walletAgeInDays > daysInYear) ?
                <div className="bg-white/10 md:bg-transparent rounded-full flex gap-2.5 xl:gap-2 px-[13px] py-[5px] xl:px-2.5 xl:py-0.5 md:p-0 md:w-[15px] md:h-5">
                  <Image
                    src={crown}
                    alt="crown"
                    title="OG!"
                    width={20}
                    height={13}
                  />
                  <p className="md:hidden xl:text-sm">
                    OG!
                  </p>
                </div>
                : null}
            </div>
            <div className="flex gap-[7px] xl:gap-1 text-right">
              <Image
                src={star}
                alt="star"
                width={20}
                height={20}
              />
              <p className="xl:text-sm">
                {leaderboardUser.points % 1 === 0 ? leaderboardUser.points : leaderboardUser.points.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Home;
