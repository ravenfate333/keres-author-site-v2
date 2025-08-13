export const ACCORDION_PAGE_QUERY = `
  *[_type == "accordionPage" && _id == $id][0]{
    isEnabled,
    "intro": coalesce(intro, []),
    sections[]{
      title,
      "slug": slug.current,
      "body": coalesce(body, [])
    }
  }
`;

export const ACCORDION_HAS_CONTENT = `{
  "cw": {
    "isEnabled": *[_type == "accordionPage" && _id == "singleton-contentWarnings"][0].isEnabled,
    "sections": count(*[_id == "singleton-contentWarnings"][0].sections),
    "intro": count(*[_id == "singleton-contentWarnings"][0].intro)
  },
  "faq": {
    "isEnabled": *[_type == "accordionPage" && _id == "singleton-faq"][0].isEnabled,
    "sections": count(*[_id == "singleton-faq"][0].sections),
    "intro": count(*[_id == "singleton-faq"][0].intro)
  }
}`
