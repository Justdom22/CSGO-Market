import Image from "next/image";

import { SearchPage } from "@/components/search";
import { Filter } from "@/types";

async function getFilters(): Promise<Filter[]> {
  const res = await fetch(`${process.env.BASE_FETCH_URL}/api/items/filters`, {
    method: "GET",
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  return data["data"]["filters"];
}

export default async function Page() {
  const filters = await getFilters();

  return (
    <SearchPage filters={filters} type={[]}>
      <div className="flex flex-col w-full">
        <div className="mt-20 w-full flex flex-col">
          <h1 className="text-center">OUR ADVANTAGES</h1>

          <div className="mt-12 flex justify-center items-center md:space-x-36 xl:space-x-56">
            <div className="flex flex-col justify-center items-center md:w-36 xl:w-56">
              <Image src="/icons/chart-arrows.svg" width={52} height={52} alt="image" />

              <div className="flex flex-col justify-center items-center text-center mt-12">
                <h4>PROFITABLE</h4>
                <span className="text-body-1 mt-3">
                  The best prices for instant purchase.
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center md:w-36 xl:w-56">
              <Image src="/icons/ash-banknote.svg" width={52} height={52} alt="image" />

              <div className="flex flex-col justify-center items-center text-center mt-12">
                <h4>QUICK CONCLUSIONS</h4>
                <span className="text-body-1 mt-3">
                  The average time of receipt of items is 5 minutes.
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center md:w-36 xl:w-56">
              <Image src="/icons/cash-off.svg" width={52} height={52} alt="image" />

              <div className="flex flex-col justify-center items-center text-center mt-12">
                <h4>NO HIDDEN FEES</h4>
                <span className="text-body-1 mt-3">
                  You immediately see the final price of the product.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SearchPage>
  );
}
