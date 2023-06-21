"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Order, OrderState } from "@prisma/client";

import { toast } from "react-toastify";
import { PrimaryButton } from "@/components/input/buttons";
import { OrderView } from "@/components/order";

export default function Page() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [tradeLink, setTradeLink] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user && user.trade_link) {
      setTradeLink(user.trade_link);

      fetch("/api/user/order")
        .then((r) => r.json())
        .then((data) => setOrders(data));
    }
  }, [user]);

  function updateTradeLink() {
    if (tradeLink && tradeLink !== "") {
      const updatePromise = fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({
          trade_link: tradeLink,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (!res.ok) {
          return Promise.reject(res.status);
        }

        return res.status;
      });

      toast.promise(
        updatePromise,
        {
          pending: "Update trade link",
          success: "Trade link updated 👌",
          error: {
            render(props) {
              const status = props.data;

              return status === 422 ? "Wrong trade link" : "Unknown error 🤯";
            },
          },
        },
        {
          autoClose: 1500,
          className(context) {
            return `relative flex p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-shade-300 ${
              context?.type === "error" ? "text-error-100" : "text-white"
            }`;
          },
          progressClassName: "bg-primary-100",
        }
      );
    }
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  if (status === "loading") {
    return <div></div>;
  }

  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <h1>Profile</h1>

      <div className="flex flex-col justify-center items-center mt-12 space-y-12">
        <div className="flex justify-center items-center">
          <Image
            src={user?.image!}
            width={64}
            height={64}
            className="rounded-full"
            alt="Avatar"
          ></Image>

          <div className="ml-10 p-10 rounded-[20px] bg-shade-200">
            <h1>{user?.name}</h1>
            <h2 className="mt-2">Steam ID: {user?.steamId}</h2>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <h2>Trade offer link</h2>

          <div className="w-full mt-2 p-[2px] bg-transparent rounded-[10px] focus-within:bg-gradient-200 transition-all delay-75">
            <div className="bg-shade-200 rounded-[10px] pl-5 h-12 flex items-center justify-between">
              <input
                value={tradeLink}
                onChange={(e) => setTradeLink(e.target.value)}
                className="w-full bg-transparent outline-none"
                type="text"
                placeholder="Link to exchange (trade-url)"
              ></input>

              <PrimaryButton
                style={{
                  marginLeft: "8px",
                  marginRight: "8px",
                  width: "80px",
                  height: "40px",
                }}
                text="Apply"
                onClick={updateTradeLink}
              />
            </div>
          </div>
        </div>

        <div className="max-w-[600px] flex flex-col justify-center items-center mt-24">
          <h2>Orders history</h2>
          {orders.length === 0 && (
            <span className="mt-2 text-body-1 font-body-1">
              You have not made any orders
            </span>
          )}

          <div className="w-full flex flex-col mt-4 space-y-6">
            {orders.map((order) => (
              <OrderView key={order.id} order={order}>
                <h3
                  className={
                    `${order.state == OrderState.TRADE && "text-white animate-pulse"} ` +
                    `${order.state == OrderState.COMPLETED && "text-success-100"} ` +
                    `${order.state == OrderState.CANCELED && "text-error-100"} `
                  }
                >
                  {order.state}
                </h3>
              </OrderView>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
