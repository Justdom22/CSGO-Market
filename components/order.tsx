"use client";

import Image from "next/image";

import { Order, OrderState, Prisma } from "@prisma/client";

interface Props {
  order: Order;
  itemsLinks?: boolean;

  children?: React.ReactNode;
}

const OrderView: React.FC<Props> = ({ order, itemsLinks, children }) => {
  function getOrderItems(order: Order) {
    const items: JSX.Element[] = [];

    if (Array.isArray(order.items)) {
      const itemsArray = order.items as Prisma.JsonArray;

      itemsArray.forEach((i) => {
        const itemObject = i as Prisma.JsonObject;
        const market_hash_name = itemObject["market_hash_name"]?.toString();

        items.push(
          <div
            key={market_hash_name}
            title={market_hash_name}
            onClick={() => {
              if (itemsLinks) {
                window.open(`https://market.csgo.com/${market_hash_name}`, "_blank");
              }
            }}
            className="bg-shade-300 rounded-[10px] w-24 h-24 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Image
              src={`https://cdn2.csgo.com/item/${market_hash_name}/512.png`}
              alt={market_hash_name!}
              width={76}
              height={76}
            />
          </div>
        );
      });
    }

    return items;
  }

  return (
    <div
      key={`order_${order.id}`}
      className="bg-shade-200 rounded-[20px] flex flex-col px-5 py-3"
    >
      <div className="flex justify-start text-primary-100">
        <h3>{order.sum}$</h3>
      </div>
      <div className="flex items-center space-x-4 mt-4 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-black-blue">
        {getOrderItems(order)}
      </div>
      <div className="flex justify-end mt-3">{children}</div>
    </div>
  );
};

export { OrderView };
