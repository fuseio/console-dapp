import github from "@/assets/github-gray.svg";
import twitter from "@/assets/twitter-gray.svg";
import telegram from "@/assets/telegram-gray.svg";
import discord from "@/assets/discord-gray.svg";
import youtube from "@/assets/youtube-gray.svg";
import Image from "next/image";
import * as amplitude from "@amplitude/analytics-browser";

const socials = [
  {
    name: "GitHub",
    logo: github,
    link: "https://github.com/fuseio"
  },
  {
    name: "Twitter",
    logo: twitter,
    link: "https://twitter.com/intent/user?screen_name=Fuse_network"
  },
  {
    name: "Telegram",
    logo: telegram,
    link: "https://t.me/fuseio"
  },
  {
    name: "Discord",
    logo: discord,
    link: "https://discord.com/invite/jpPMeSZ"
  },
  {
    name: "YouTube",
    logo: youtube,
    link: "https://www.youtube.com/c/fusenetwork?sub_confirmation=1"
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-light-gray flex flex-col items-center pt-[50px] border-t-[0.3px] border-pastel-gray">
      <div className="w-8/9 flex justify-between flex-row gap-y-4 items-center md:flex-col mb-12 md:w-9/10 max-w-7xl">
        <div className="flex md:flex-wrap md:justify-center gap-8 md:gap-4 md:text-center text-text-dark-gray text-base/4 font-medium">
          <a
            href="https://docs.fuse.io"
            target="_blank"
            className="transition ease-in-out hover:text-darker-gray"
            onClick={() => amplitude.track("Go to Docs")}
          >
            Read the Docs
          </a>
          <a
            href="https://north-crocus-61d.notion.site/Terms-of-Service-f9995aaf4f2a48e19a0beafbcc41116e?pvs=4"
            target="_blank"
            className="transition ease-in-out hover:text-darker-gray"
          >
            Terms & Conditions
          </a>
          <a
            href="mailto:console@fuse.io"
            className="transition ease-in-out hover:text-darker-gray"
          >
            Contact us
          </a>
        </div>
        <div className="flex gap-8 items-center">
          {socials.map((social, i) =>
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition ease-in-out delay-150 duration-300 hover:scale-125"
            >
              <Image src={social.logo} alt={social.name} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
