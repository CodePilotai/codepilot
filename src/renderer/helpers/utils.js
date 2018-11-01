export function or(args, expectation) {
  return expectation
    ? args.some(arg => arg === expectation)
    : args.some(arg => !!arg)
}
