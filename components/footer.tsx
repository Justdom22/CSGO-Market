import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full mt-24">
      <div className="border-t border-shade-300 mx-44 lg:mx-72 xl:mx-96 mb-12">
        <div className="flex mt-6">
          <div className="flex flex-col">
            <Image src="/logo.svg" width={166} height={61} alt={""} />
            <span className="text-body-1 mt-6">
              Reliable service for buying
              <br /> Steam skins with fast
              <br /> withdrawals
            </span>
          </div>
          <div className="flex space-x-16 ml-28">
            <div className="flex flex-col text-body-1 space-y-6">
              <Link href="/">Home</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/">Support</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-shade-200 h-16 px-96 flex items-center justify-between">
        <span className="text-body-1 text-shade-500">@2023 market.brmcsgo.com</span>

        <div className="flex space-x-7">
          <Link href="https://ru-ru.facebook.com/">
            <Image src="/icons/Facebook.svg" width={18} height={18} alt={""} />
          </Link>
          <Link href="https://www.instagram.com/">
            <Image src="/icons/Instagram.svg" width={18} height={18} alt={""} />
          </Link>
          <Link href="https://twitter.com/">
            <Image src="/icons/Twitter.svg" width={18} height={18} alt={""} />
          </Link>
          <Link href="https://www.youtube.com/">
            <Image src="/icons/YouTube.svg" width={18} height={18} alt={""} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export { Footer };
