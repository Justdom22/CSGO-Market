export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/profile/", "/cart/"],
    },
    sitemap: `${process.env.BASE_FETCH_URL}/sitemap.xml`,
  };
}
