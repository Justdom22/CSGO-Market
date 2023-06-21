export default async function sitemap() {
  const filtersResponse = await fetch(`${process.env.BASE_FETCH_URL}/api/items/filters`, {
    method: "GET",
  });

  const filters = await filtersResponse.json();
  const typeFilter = filters["data"]["filters"].find((f) => f.id === "type");

  var filtersIndex = [];

  typeFilter?.items.map((filter) => {
    filtersIndex.push({
      url: `${process.env.BASE_FETCH_URL}/${filter.id}`,
      lastModified: new Date().toISOString(),
    });

    filter?.items.map((filterItem) => {
      filtersIndex.push({
        url: `${process.env.BASE_FETCH_URL}/${filterItem.id}`,
        lastModified: new Date().toISOString(),
      });
    });
  });

  const index = {
    url: process.env.BASE_FETCH_URL,
    lastModified: new Date(),
  };

  return [index, ...filtersIndex];
}
