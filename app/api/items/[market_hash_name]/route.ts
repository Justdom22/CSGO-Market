import { NextRequest, NextResponse } from "next/server";

import { gql } from "@apollo/client";
import client from "@/api/apollo-client";

import { Item, PriceHistory } from "@/types";

interface Props {
  params: {
    market_hash_name: string;
  };
}

export async function handler(req: NextRequest, { params }: Props) {
  const { data: itemResponse } = await client.query({
    query: gql`
      query viewItem($id: String, $market_hash_name: String!, $phase: String) {
        viewItem(id: $id, market_hash_name: $market_hash_name, phase: $phase) {
          asset
          color
          price
          itemtype
          quality
          popularity
          ctp
          seo {
            category
            type
            __typename
          }
          meta {
            title
            description
            __typename
          }
          jsonSchema
          rarity
          rarity_ext {
            id
            name
            __typename
          }
          slot
          cases {
            seo {
              category
              type
              __typename
            }
            image
            name
            __typename
          }
          offers {
            count
            price
            currency
            __typename
          }
          collection {
            image
            name
            __typename
          }
          stattrak
          quality
          links {
            view_3d
            view_in_game
            view_screenshot
            view_refresh_image
            __typename
          }
          stickers {
            image
            name
            id
            __typename
          }
          tags {
            category
            category_name
            internal_name
            localized_category_name
            localized_tag_name
            name
            value {
              link
              name
              __typename
            }
            __typename
          }
          type
          currency
          descriptions {
            type
            value
            rarity
            __typename
          }
          features
          float {
            paintindex
            paintseed
            paintwear
            screenshot
            __typename
          }
          id
          my_item
          my_order {
            price
            total
            __typename
          }
          my_notify {
            price
            __typename
          }
          status
          image_512
          image_300
          market_hash_name
          market_name
          market_name_ext {
            subtitle
            title
            __typename
          }
          quality_ext {
            id
            subtitle
            title
            __typename
          }
          phase
          phase_short
          __typename
        }
      }
    `,
    variables: {
      market_hash_name: params.market_hash_name,
    },
  });

  const { data: historyResponse } = await client.query({
    query: gql`
      query history($market_hash_name: String!, $phase: String) {
        history(market_hash_name: $market_hash_name, phase: $phase) {
          price
          time
          count
          __typename
        }
      }
    `,
    variables: {
      market_hash_name: params.market_hash_name,
    },
  });

  const item: Item = { ...itemResponse["viewItem"] };
  item.price = item.price + Math.ceil((item.price * process.env.PRICE_MARKUP) / 100);
  item.ctp = item.ctp - Math.ceil((item.ctp * process.env.PRICE_MARKUP) / 100);

  const history: PriceHistory[] = [];

  historyResponse["history"].map((h: PriceHistory) => {
    history.push({
      time: h.time,
      price: h.price + Math.ceil((h.price * process.env.PRICE_MARKUP) / 100),
    });
  });

  history[0].price = item.price;

  let json_response = {
    item: item,
    history: history,
  };

  return NextResponse.json(json_response);
}

export { handler as GET };
