export default function githubResponseMeta(response) {
  return {
    totalPages:
      response.links && response.links.last
        ? Number(response.links.last.match(/page=(\d+)/)[1])
        : 0,
    rateLimitRemaining: Number(response.headers['x-ratelimit-remaining']),
    retryAfter: response.header['retry-after']
      ? new Date().getTime() + Number(response.header['retry-after']) * 1000
      : 0
  }
}
