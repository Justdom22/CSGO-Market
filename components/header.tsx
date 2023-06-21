"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

import Link from "next/link";
import Image from "next/image";

import { PROVIDER_ID } from "next-auth-steam";
import { useSession, signIn } from "next-auth/react";

import ShoppingBag from "@/icons/shopping-bag.svg";

import { PrimaryButton } from "./input/buttons";
import { Navbar } from "./navigation";
import { ShowSupport } from "./input/modal";

const pages = [
  {
    title: "Buy",
    href: "/",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Support",
    onClick: () => ShowSupport(),
  },
];

const Header = () => {
  const { data: session } = useSession();

  const [balance, setBalance] = useState(0);
  const cartItemsCount = useAppSelector((state) => state.cart.length);

  useEffect(() => {
    if (session != undefined && session.user != undefined) {
      setBalance(session.user.balance!);
    }
  }, [session, session?.user]);

  return (
    <div className="w-full h-[88px] px-5 bg-shade-200 flex justify-between">
      <Link href="/" className="my-auto">
        <Image src="/logo.svg" width={125} height={46} alt="logo" />
      </Link>

      <div className="my-auto flex flex-row-reverse items-center space-x-12 space-x-reverse">
        {session ? (
          <div className="space-x-8 flex justify-center items-center">
            <Link
              href="/profile"
              className="_profile flex justify-center items-center cursor-pointer text-white hover:text-primary-100"
            >
              <Image
                src={session.user?.image!}
                loading="lazy"
                width={50}
                height={50}
                alt="Avatar"
                className="rounded-full"
              />
              <span className="text-body-1 font-body-1 ml-3">{session.user?.name}</span>
            </Link>

            <div className="flex space-x-4 justify-center items-center group">
              <Link
                href="/profile/payment"
                className="bg-primary-100 hover:bg-primary-300 active:bg-shade-100 active:text-primary-100 p-3 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
              >
                <Image
                  src="/icons/plus.svg"
                  width={16}
                  height={21}
                  alt="Add money"
                  className="mr-2 group-hover:rotate-360 transition-all ease-in-out"
                ></Image>
                <span className="text-body-1 font-body-1">{balance}$</span>
              </Link>

              <Link
                href="/cart"
                className="bg-shade-300 w-9 h-9 rounded-[10px] fill-white hover:fill-primary-100 active:fill-shade-400 flex justify-center items-center relative"
              >
                <ShoppingBag />

                {cartItemsCount > 0 && (
                  <div className="absolute flex justify-center items-center bg-primary-100 rounded-full w-5 h-5 bottom-6 left-6">
                    <span className="text-body-3 font-body-3 text-white">
                      {cartItemsCount}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        ) : (
          <PrimaryButton
            onClick={() => signIn(PROVIDER_ID)}
            text="Sign in with Steam"
            style={{
              width: "208px",
              height: "48px",
            }}
          />
        )}

        <Navbar endpoints={pages} />
      </div>
    </div>
  );
};

export { Header };
