"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem } from "@/store/cart";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Item } from "@/types";

import { toast } from "react-toastify";
import { CartItemCard } from "@/components/items";
import { PrimaryButton, SecondaryButton } from "@/components/input/buttons";

export default function Page() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const cartItems = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [items, setItems] = useState<Item[]>([]);

  const isEmpty = cartItems.length === 0;
  const isLoading = items.length === 0 && !isEmpty;
  const sum =
    !isEmpty && !isLoading ? items.map((item) => item.price).reduce((a, b) => a + b) : 0;

  useEffect(() => {
    getItems();
  }, [cartItems]);

  async function getItems() {
    const fetchedItems = await Promise.all(
      cartItems.map(async (i): Promise<Item> => {
        const res = await fetch(`/api/items/${i.market_hash_name}`);
        const data = await res.json();

        return data["item"];
      })
    );

    setItems(fetchedItems);
  }

  function getBlankItems() {
    const items = [];

    for (let index = 0; index < cartItems.length; index++) {
      items.push(<CartItemCard key={`blank_item_${index}`} />);
    }

    return items;
  }

  function clearCart() {
    cartItems.map((i) => dispatch(removeItem(i.market_hash_name)));
  }

  function createOrder() {
    const orderPromise = fetch("/api/user/order", {
      method: "POST",
      body: JSON.stringify({
        items: [...cartItems.map((i) => i.market_hash_name)],
      }),
    }).then((res) => {
      if (!res.ok) {
        return Promise.reject(res.status);
      }

      clearCart();

      return res.status;
    });

    toast.promise(
      orderPromise,
      {
        pending: "Order is pending",
        success: "Order created 👌",
        error: {
          render(props) {
            const status = props.data;

            if (status === 400) return "Not enough money 😓";

            if (status === 403) return "Please set trade link ⚠";

            return "Unknown error 🤯";
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

  if (status == "unauthenticated" || !user) {
    redirect("/");
  }

  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <h1>Cart</h1>

      {!isEmpty && (
        <div className="flex flex-col mt-6 space-y-12">
          <div
            className={
              "grid gap-y-5 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 " +
              `${isLoading ? "animate-pulse" : ""}`
            }
          >
            {isLoading && getBlankItems()}

            {!isLoading &&
              items.map((item) => (
                <CartItemCard key={`item_${item.market_hash_name}`} item={item} />
              ))}
          </div>

          <div className="bg-shade-200 rounded-[20px] p-10 flex justify-between">
            <div className="flex flex-col space-y-4">
              <h1>Total price: {sum.toFixed(2)}$</h1>
              <h1>Items: {items.length}</h1>
            </div>
            <div className="flex flex-col space-y-4">
              <PrimaryButton
                style={{
                  width: "160px",
                  height: "40px",
                }}
                text="Buy"
                onClick={createOrder}
                disabled={user?.balance < sum || isLoading}
              />
              <SecondaryButton
                style={{
                  width: "160px",
                  height: "40px",
                }}
                text="Empty cart"
                onClick={clearCart}
              />
            </div>
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="w-full h-full mt-10 flex justify-center items-center">
          <h2>You cart is empty</h2>
        </div>
      )}
    </main>
  );
}
