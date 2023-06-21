import Image from "next/image";

interface BannerProps {
  children?: React.ReactNode;
}

const Banner = (props: BannerProps) => {
  return (
    <div className="_banner w-full h-64 lg:h-72 xl:h-80 my-6 px-5">
      <div className="w-full h-full flex justify-center items-center relative">
        <Image
          src="/banner.png"
          alt=""
          loading="lazy"
          fill
          quality={100}
          className="object-cover w-full rounded-2xl -z-10"
        />
        <div className="w-full h-full md:pt-8 lg:pt-12 xl:pt-16 pl-16 lg:pl-28 xl:pl-32 flex flex-col items-start">
          <h1>
            <span className="text-primary-100">BRM CSGO</span> - the best marketplace for
            <br />
            CS GO skins
          </h1>

          <div className="flex flex-col mt-3 space-y-3">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export { Banner };
