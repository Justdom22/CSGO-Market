"use client"

import Image from "next/image";
import Link from "next/link";

import { ShowSupport } from "./input/modal";

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

            <div className="flex items-center space-x-4 mt-8">
              <Image src="/icons/master-card.png" alt="visa" width={65} height={39} className="h-10" />
              <Image src="/icons/visa.png" alt="visa" width={68} height={21} className="h-5" />
            </div>
          </div>
          <div className="flex space-x-16 ml-28">
            <div className="flex flex-col text-body-1 space-y-6">
              <Link href="/">Home</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/" onClick={(e) => {
                e.preventDefault();
                ShowSupport();
              }}>Support</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-shade-200 h-16 px-96 flex items-center justify-between">
        <span className="text-body-1 text-shade-500">@2023 market.brmcsgo.com</span>
      </div>
    </div>
  );
};

export { Footer };
