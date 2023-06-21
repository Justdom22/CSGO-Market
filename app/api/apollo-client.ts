import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://market.csgo.com/api/graphql",
    cache: new InMemoryCache(),
    headers: {
        "Referer": "https://market.csgo.com/en/"
    }
});

export default client;