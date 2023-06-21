import { NextRequest, NextResponse } from "next/server";

import { gql } from "@apollo/client";
import client from "@/api/apollo-client";

import { Item } from "@/types";

export async function handler(req: NextRequest) {
  const variables = await req.json();

  const { data: response } = await client.query({
    query: gql`
      query items(
        $count: Int
        $filters: [FilterInputType]
        $page: Int
        $order: OrderInputType!
      ) {
        items(count: $count, filters: $filters, page: $page, order: $order) {
          paginatorInfo {
            count
            currentPage
            hasMorePages
            lastPage
            perPage
            total
            __typename
          }
          filters {
            id
            items {
              color
              enabled
              id
              name
              value
              image
              __typename
            }
            max
            min
            name
            order
            type
            value
            __typename
          }
          meta {
            title
            description
            __typename
          }
          data {
            color
            id
            currency
            stattrak
            slot
            popularity
            features
            rarity
            rarity_ext {
              id
              name
              __typename
            }
            ctp
            quality
            phase
            descriptions {
              type
              value
              __typename
            }
            type
            tags {
              category
              category_name
              localized_category_name
              localized_tag_name
              internal_name
              name
              value {
                name
                link
                __typename
              }
              __typename
            }
            image_512
            image_100
            image_150
            image_300
            seo {
              category
              type
              __typename
            }
            market_hash_name
            market_name
            price
            stickers {
              image
              name
              __typename
            }
            __typename
          }
          paginatorInfo {
            count
            currentPage
            hasMorePages
            lastPage
            perPage
            total
            __typename
          }
          __typename
        }
      }
    `,
    variables: {
      count: 24,
      order: {
        id: "popularity",
        direction: "desc",
      },
      filters: variables["filters"],
      page: variables["page"],
    },
  });

  const data = response["items"];
  const responseItems: Item[] = data["data"];

  const items: Item[] = [];
  const paginatorInfo = data["paginatorInfo"];

  responseItems.forEach((i) => {
    const item = { ...i };

    item.price = item.price + Math.ceil((item.price * process.env.PRICE_MARKUP) / 100);
    item.ctp = item.ctp - Math.ceil((item.ctp * process.env.PRICE_MARKUP) / 100);

    items.push(item);
  });

  let json_response = {
    data: items,
    paginatorInfo: paginatorInfo,
  };

  return NextResponse.json(json_response);
}

export { handler as POST };
