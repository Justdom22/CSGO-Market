"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { PROVIDER_ID } from "next-auth-steam";
import { useSession, signIn } from "next-auth/react";

import { addItem, removeItem } from "@/store/cart";
import { useAppDispatch } from "@/store/hooks";

import { Filter, Item, ShortFilter } from "@/types";

import { toast } from "react-toastify";
import { FiltersPanel } from "./input/filters";
import { TypeNavigation } from "./navigation";
import { SecondaryButton } from "./input/buttons";

import SteamIcon from "@/icons/Steam.svg";
import ShoppingBag from "@/icons/shopping-bag.svg";

interface ItemProps {
  item?: Item;
}

const ItemCard: React.FC<ItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  return (
    <div
      className="w-[244px] h-[361px] rounded-[20px] hover:bg-gradient-100 hover:p-[2px] hover:cursor-pointer transition-all"
      title={item?.market_name}
    >
      <div className="w-full h-full flex flex-col bg-shade-200 rounded-[20px] pl-3 pr-3 pt-[14px]">
        {item && (
          <div className="h-6 self-end hover:cursor-pointer">
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={`https://steamcommunity.com/market/listings/730/${item?.market_hash_name}`}
            >
              <SteamIcon className="w-6 h-6 fill-shade-400 hover:fill-primary-100" />
            </Link>
          </div>
        )}

        {item && (
          <Link
            href={`/item/${item?.market_hash_name}`}
            className="w-full flex flex-col justify-center items-center"
          >
            <div className="w-[170px] h-[127px] flex">
              <Image
                width={170}
                height={127}
                quality={100}
                src={item.image_300!}
                alt={item.market_name}
                loading="lazy"
                className=" object-cover"
              />
            </div>

            <div className="mt-2 px-3 flex items-center justify-center rounded-3xl bg-primary-400 border-primary-300 border-2 text-primary-100 text-body-1 font-medium">
              <span className="text-body-2">{item.quality}</span>
              <ShoppingBag className="fill-primary-100 w-4 h-4 mx-1" />
              <span className="text-body-2">{item.popularity}</span>
            </div>

            <h2 className="mt-3 text-center line-clamp-2 h-12">{item.market_name}</h2>

            <div className="flex justify-center items-center mt-2">
              <h3>{item.price.toFixed(2)}$</h3>
              {item.ctp != 0 && <h3 className="text-primary-100 ml-3">-{item.ctp}%</h3>}
            </div>

            <SecondaryButton
              text="Add to cart"
              style={{
                width: "100%",
                height: "40px",
                marginTop: "16px",
                marginBottom: "16px",
              }}
              preventDefault
              onClick={() => {
                if (!session) {
                  signIn(PROVIDER_ID);
                  return;
                }

                toast.success("Item added", {
                  autoClose: 1500,
                  className(context) {
                    return `relative flex p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-shade-300 ${
                      context?.type === "error" ? "text-error-100" : "text-white"
                    }`;
                  },
                  progressClassName: "bg-primary-100",
                });

                dispatch(addItem(item.market_hash_name));
              }}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

const CartItemCard: React.FC<ItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="w-[244px] h-[325px] rounded-[20px] hover:bg-gradient-100 hover:p-[2px] hover:cursor-pointer transition-all"
      title={item?.market_name}
    >
      <div className="w-full h-full flex flex-col bg-shade-200 rounded-[20px] pl-3 pr-3 pt-[14px]">
        {item && (
          <div className="h-6 self-end hover:cursor-pointer">
            <Link
              rel="noopener noreferrer"
              target="_blank"
              href={`https://steamcommunity.com/market/listings/730/${item?.market_hash_name}`}
            >
              <SteamIcon className="w-6 h-6 fill-shade-400 hover:fill-primary-100" />
            </Link>
          </div>
        )}

        {item && (
          <Link
            href={`/item/${item?.market_hash_name}`}
            className="w-full flex flex-col justify-center items-center"
          >
            <div className="w-[170px] h-[127px] flex">
              <Image
                width={170}
                height={127}
                quality={100}
                src={item.image_300!}
                alt={item.market_name}
                loading="lazy"
                className=" object-cover"
              />
            </div>

            <h2 className="mt-3 text-center line-clamp-2 h-12">{item.market_name}</h2>

            <div className="flex justify-center items-center my-2">
              <h3>{item.price.toFixed(2)}$</h3>
            </div>

            <SecondaryButton
              text="Remove from cart"
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                height: "40px",
              }}
              preventDefault
              onClick={() => {
                dispatch(removeItem(item.market_hash_name));
              }}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

interface SearchProps {
  apiFilters: Filter[];
  itemType?: string;
  itemId?: string;
}

const ItemsSearch: React.FC<SearchProps> = ({ apiFilters, itemType, itemId }) => {
  const [items, setItems] = useState<Item[]>([]);

  const [filters, setFilters] = useState<ShortFilter[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [prevPage, nextPage] = [
    page > 0 ? page - 1 : 0,
    page < lastPage ? page + 1 : lastPage,
  ];

  useEffect(() => {
    updateItems();
  }, [page, filters]);

  function updateItems() {
    var typeFilter: ShortFilter = {
      id: "type",
    };

    if (itemType !== undefined) {
      const type: ShortFilter = {
        id: decodeURI(itemType),
      };

      if (itemId !== undefined) {
        type.items = [
          {
            id: decodeURI(itemId),
          },
        ];
      }

      typeFilter.items = [type];
    }

    setLoading(true);

    fetch("/api/items", {
      method: "POST",
      cache: "force-cache",
      body: JSON.stringify({
        page: page,
        filters: [...filters, typeFilter],
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        const lastPage = response["paginatorInfo"]["lastPage"];

        setItems(response["data"]);
        setLastPage(lastPage);

        if (page > lastPage) {
          setPage(0);
        }

        setLoading(false);
      });
  }

  function getBlankItems() {
    const items = [];

    for (let index = 0; index < 24; index++) {
      items.push(<ItemCard key={`blank_item_${index}`} />);
    }

    return items;
  }

  function getPagination() {
    const paginationButtons = [];

    const startPage = page > 5 ? page - 5 : 0;

    for (let index = startPage; index < lastPage; index++) {
      paginationButtons.push(
        <SecondaryButton
          key={`pagination_button_${index}`}
          style={{
            width: "40px",
            height: "40px",
            backgroundImage: page == index ? "linear-gradient(180deg, #2AC8EB 0%, #00A7CC 100%)" : ""
          }}
          text={`${index + 1}`}
          onClick={() => setPage(index)}
        />
      );

      if (paginationButtons.length === 9) break;
    }

    return paginationButtons;
  }

  return (
    <div className="main mt-6 flex flex-col space-y-6">
      <div className="w-full px-5">
        <TypeNavigation apiFilters={apiFilters} />
      </div>

      <div className="flex items-start pr-5">
        <FiltersPanel
          filters={filters}
          apiFilters={apiFilters}
          onFiltersChanged={(f) => setFilters(f)}
        />

        <div className="w-full ml-6 mb-6">
          <div
            className={`ml-3 grid gap-y-5 gap-x-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6 ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {!isLoading &&
              items.map((item, index) => (
                <ItemCard key={`item_${item.market_hash_name}_cart`} item={item} />
              ))}

            {isLoading && getBlankItems()}
          </div>

          {lastPage > 1 && (
            <div className="mt-6 px-2 h-10 flex justify-between">
              <SecondaryButton
                style={{
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => setPage(prevPage)}
              >
                <Image src="/icons/arrow-left.svg" width={24} height={24} alt="" />
              </SecondaryButton>

              <div className="space-x-2 flex">{getPagination()}</div>

              <SecondaryButton
                style={{
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => setPage(nextPage)}
              >
                <Image src="/icons/arrow-right.svg" width={24} height={24} alt="" />
              </SecondaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { CartItemCard, ItemCard, ItemsSearch };
