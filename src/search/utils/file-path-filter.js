export default function filePathFilter(filePath) {
  return ![
    /\.lock$/,
    /\.min\.\w+$/,
    /\.dll$/,
    /\.exe$/,
    // Non-source folders
    /\/dist\//,
    /\/cache\//,
    /\/tmp\//
  ].some(
    regexOrString =>
      regexOrString instanceof RegExp
        ? regexOrString.test(filePath)
        : filePath.includes(regexOrString)
  )
}
