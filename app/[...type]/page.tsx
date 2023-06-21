import { Metadata, ResolvingMetadata } from "next";

import { Filter } from "@/types";
import { SearchPage } from "@/components/search";
import { redirect } from "next/navigation";

type Props = {
  params: { type: string[] };
};

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  var title = decodeURI(params.type[params.type.length - 1]);

  return {
    title: `${title} | BRM CSGO`,
  };
}

export default async function Page({ params }: Props) {
  const filters = await getFilters();

  const rootType = filters
    .find((f) => f.id == "type")
    ?.items?.find((f) => f.id === decodeURI(params.type[0]));

  if (rootType === undefined) {
    redirect("/");
  }

  return <SearchPage filters={filters} type={params.type} />;
}
