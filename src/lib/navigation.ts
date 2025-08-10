export const NAVBAR_QUERY = `{
  "settings": *[_type == "navigation" && _id == "singleton-navigation"][0]{
    storeLink{label, url},
    shopLinks[]{label, url},
    moreLinks[]{label, url}
  },
  "series": *[_type == "series"]|order(title asc){
    "type": "series",
    "label": title,
    "slug": slug.current
  },
  "standalones": *[_type == "book" && !defined(series)]|order(title asc){
    "type": "book",
    "label": title,
    "slug": slug.current
  },
}`;
