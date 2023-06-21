"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { addItem } from "@/store/cart";
import { useAppDispatch } from "@/store/hooks";
import { PrimaryButton } from "@/components/input/buttons";
import { Chart } from "@/components/chart";

import CopyIcon from "@/icons/copy.svg";

import { Item, PriceHistory } from "@/types";

const ItemPage: React.FC<{ market_hash_name: string }> = ({ market_hash_name }) => {
  const [item, setItem] = useState<Item | null>();
  const [priceHistory, setPriceHistory] = useState<PriceHistory[] | null>();

  const minPrice = priceHistory && Math.min(...priceHistory.map((h) => h.price));
  const maxPrice = priceHistory && Math.max(...priceHistory.map((h) => h.price));

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(`/api/items/${market_hash_name}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data["item"]);
        setPriceHistory(data["history"]);
      });
  }, [market_hash_name]);

  return (
    <div>
      <div className="flex">
        <div
          className={
            "bg-shade-200 rounded-[20px] flex justify-center items-center p-12 ml-20 w-[256px] h-[240px] xl:p-20 xl:w-[512px] xl:h-[460px] " +
            `${!item ? "animate-pulse" : ""}`
          }
        >
          {item && (
            <Image
              src={item.image_512!}
              alt="image"
              quality={100}
              width={512}
              height={384}
            />
          )}
        </div>

        <div className="ml-16 xl:ml-12 flex flex-col">
          {!item ? (
            <div className="bg-shade-200 w-[400px] h-12 animate-pulse"></div>
          ) : (
            <h1 className="text-shade-400 w-[400px]">{item && item.market_name}</h1>
          )}

          {!item ? (
            <div className="mt-4 bg-shade-200 w-[400px] h-6 animate-pulse"></div>
          ) : (
            <div className="flex items-center mt-4 text-shade-500 hover:text-shade-400">
              <h4>{item.market_name}</h4>
              <button
                className="ml-1 flex"
                onClick={() => {
                  navigator.clipboard.writeText(item.market_name);
                }}
              >
                <CopyIcon className="w-5 h-5 stroke-white hover:stroke-primary-100 active:stroke-white" />
              </button>
            </div>
          )}

          <div className="flex mt-4 space-x-20">
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col">
                <span className="text-body-3 font-body-3 text-shade-500">Quality</span>
                {item && (
                  <span className="text-body-3 font-body-3 text-white mt-2">
                    {item.quality_ext?.title} — {item.quality_ext?.subtitle}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-body-3 font-body-3 text-shade-500">Rarity</span>
                {item && (
                  <span className="text-body-3 font-body-3 text-white mt-2">
                    {item.rarity}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col">
                <span className="text-body-3 font-body-3 text-shade-500">Category</span>
                {item && (
                  <span className="text-body-3 font-body-3 text-white mt-2">
                    {item.slot}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-7">
            <span className="text-body-3 font-body-3 text-shade-500">Price</span>

            {item && (
              <div className="flex space-x-3 text-center">
                <h2 className="text-primary-100">{item.price.toFixed(2)}$ </h2>
                {item.ctp > 0 && <h2 className="text-error-100">-{item.ctp}%</h2>}
              </div>
            )}
          </div>

          {item && (
            <div className="mt-6 flex space-x-4">
              <PrimaryButton
                text="Add to cart"
                style={{
                  width: "214px",
                  height: "50px",
                }}
                onClick={() => {
                  dispatch(addItem(market_hash_name));
                }}
              />
            </div>
          )}

          <div className="mt-6 pt-6 w-full border-shade-300 border-t">
            <span className="text-body-3 font-body-3 text-shade-500">Description</span>

            {!item ? (
              <div className="mt-2 bg-shade-200 w-[400px] h-36 animate-pulse"></div>
            ) : (
              <div className="mt-2 w-[460px]">
                {item.descriptions
                  ?.filter((d) => d.type == "html")
                  .map((d, index) => (
                    <div key={`desc_${index}`}>
                      <span className="text-body-3 font-body-3 text-white">
                        {d?.value}
                      </span>
                    </div>
                  ))}

                <div className="grid grid-cols-2">
                  {item.descriptions
                    ?.filter((d) => d.type == "item")
                    .map((d, index) => (
                      <div key={`desc_${index}`}>
                        <span className="text-body-3 font-body-3 text-white">
                          {d?.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-24 px-40">
        <h2>Dynamics of price change</h2>

        <div className="mt-6 flex space-x-4">
          <div className="w-44 h-16 bg-shade-200 rounded-[10px] flex flex-col justify-center items-center">
            <span className="text-body-3 font-body-3 text-shade-500">Min Price</span>
            <span className="text-body-3 font-body-3 text-shade-white mt-2">
              {minPrice}$
            </span>
          </div>
          <div className="w-44 h-16 bg-shade-200 rounded-[10px] flex flex-col justify-center items-center">
            <span className="text-body-3 font-body-3 text-shade-500">Max Price</span>
            <span className="text-body-3 font-body-3 text-shade-white mt-2">
              {maxPrice}$
            </span>
          </div>
        </div>

        {priceHistory && (
          <Chart
            labels={priceHistory.reverse().map((p) => p.time * 1000)}
            data={priceHistory.map((p) => p.price.toString())}
          />
        )}
      </div>
    </div>
  );
};

export { ItemPage };
