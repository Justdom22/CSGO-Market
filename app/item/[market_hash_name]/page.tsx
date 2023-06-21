import { Metadata, ResolvingMetadata } from "next";

import { Item } from "@/types";
import { ItemPage } from "./item";

type Props = {
  params: { market_hash_name: string };
};

export async function generateMetadata(
  { params }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const market_hash_name = decodeURI(params.market_hash_name);

  const res = await fetch(`${process.env.BASE_FETCH_URL}/api/items/${market_hash_name}`);
  const data = await res.json();

  const item: Item = data["item"];

  return {
    title: `${item.market_hash_name} Buy on BRM CSGO Market`,
    openGraph: {
      images: [item.image_300!],
    },
  };
}

export default function Page({ params }: Props) {
  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <ItemPage market_hash_name={params.market_hash_name} />
    </main>
  );
}
