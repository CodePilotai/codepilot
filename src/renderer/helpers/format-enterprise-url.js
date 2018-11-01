import * as URL from 'url'

/** The protocols over which we can connect to Enterprise instances. */
const AllowedProtocols = new Set(['https:', 'http:'])

/**
 * Validate the URL for a GitHub Enterprise instance.
 *
 * Returns the validated URL, or throws if the URL cannot be validated.
 */
export default function formatEnterpriseUrl(address) {
  // ensure user has specified text and not just whitespace
  // we will interact with this server so we can be fairly
  // relaxed here about what we accept for the server name
  const trimmed = address.trim()
  if (trimmed.length === 0) {
    const error = new Error('Unknown address')
    return error
  }

  let url = URL.parse(trimmed)
  if (!url.host) {
    // E.g., if they user entered 'ghe.io', let's assume they're using https.
    address = `https://${trimmed}`
    url = URL.parse(address)
  }

  // Remove the last character if it is a slash to ensure that we know the
  // formatting in future api calls.
  if (address.charAt(address.length - 1) === '/') {
    address = address.slice(0, -1)
  }

  if (!url.protocol) {
    const error = new Error('Invalid URL')
    throw error
  }

  if (!AllowedProtocols.has(url.protocol)) {
    const error = new Error('Invalid protocol')
    throw error
  }

  return address
}
