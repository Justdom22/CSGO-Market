import { NextRequest, NextResponse } from "next/server";

import { gql } from "@apollo/client";
import client from "@/api/apollo-client";

export async function handler(req: NextRequest) {
  const { data } = await client.query({
    query: gql`
      query me {
        filters {
          id
          items {
            color
            id
            name
            plural
            icons
            items {
              color
              id
              name
              icons
              __typename
            }
            __typename
          }
          name
          order
          type
          value
          open
          __typename
        }
      }
    `,
  });

  let json_response = {
    status: "success",
    data: data,
  };

  return NextResponse.json(json_response);
}

export { handler as GET };
