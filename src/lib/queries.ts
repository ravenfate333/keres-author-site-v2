export const SOCIAL_LINKS_QUERY = `*[
  _type == "socialLinks" && _id == "singleton-socialLinks"
][0]{
  links[]{ platform, url, enabled, ariaLabel }
}`;