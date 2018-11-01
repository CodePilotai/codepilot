export default function getDomain(url) {
  return new URL(url).host || url.charAt(0)
}
