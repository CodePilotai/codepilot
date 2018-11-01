<script>
import escapeHtml from 'escape-html'

export default {
  functional: true,
  props: {
    body: {
      type: String,
      required: true
    },
    contentIsHtml: {
      type: Boolean,
      default: false
    },
    matcher: {
      type: [String, RegExp],
      default: ''
    },
    useRegex: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  render(h, { props }) {
    if (!props.matcher) {
      if (!props.contentIsHtml) {
        return <span domPropsInnerHTML={escapeHtml(props.body)} />
      } else {
        return <span domPropsInnerHTML={props.body} />
      }
    }

    let parsedMatcher = escapeHtml(props.matcher)
    if (props.useRegex) {
      parsedMatcher = new RegExp(parsedMatcher, 'g')
    }
    if (props.body.includes(props.matcher)) {
      const highlightedContent = highlightMatches([parsedMatcher])

      return <span domPropsInnerHTML={highlightedContent} />
    } else {
      const queryPartials = props.matcher
        .replace(/\s+/g, ' ')
        .match(/\w+/g)
        .map(matcher => new RegExp(`\\b${matcher}\\b`, 'gi'))

      const highlightedContent = highlightMatches(queryPartials)

      return <span domPropsInnerHTML={highlightedContent} />
    }

    function highlightMatches(stringOrRegexList) {
      let highlightedContent = props.body

      // If the body isn't already escaped as HTML,
      // manually escape it.
      if (!props.contentIsHtml) {
        highlightedContent = escapeHtml(highlightedContent)
      }

      // Abort trying to highlight a selection
      // if there's nothing to select.
      if (!stringOrRegexList.length) {
        return highlightedContent
      }
      const openingTagReplacement = '⚜️⚜️🔱🔱⚜️⚜️'
      const closingTagReplacement = '🔃🔃🎴🎴🔃🔃'
      const encodedHtmlReplacement = '🌘🌘🍄🍄🌘🌘'
      const existingOpeningTags = []
      const existingClosingTags = []
      const encodedHtml = []

      for (const stringOrRegex of stringOrRegexList) {
        if (props.contentIsHtml) {
          highlightedContent = highlightedContent.replace(
            /<span[^>]*?>/g,
            match => {
              existingOpeningTags.push(match)
              return openingTagReplacement
            }
          )
          highlightedContent = highlightedContent.replace(
            /<\/span>/g,
            match => {
              existingClosingTags.push(match)
              return closingTagReplacement
            }
          )
          highlightedContent = highlightedContent.replace(
            /&[a-z]+;/g,
            match => {
              encodedHtml.push(match)
              return encodedHtmlReplacement
            }
          )
        }

        if (stringOrRegex instanceof RegExp) {
          highlightedContent = highlightedContent.replace(
            stringOrRegex,
            match => {
              return `<span class="${props.className}">${match}</span>`
            }
          )
        } else {
          highlightedContent = highlightedContent.replace(
            stringOrRegex,
            match => {
              return `<span class="${props.className}">${match}</span>`
            }
          )
        }

        if (props.contentIsHtml) {
          highlightedContent = highlightedContent.replace(
            new RegExp(openingTagReplacement, 'g'),
            () => {
              return existingOpeningTags.shift()
            }
          )
          highlightedContent = highlightedContent.replace(
            new RegExp(closingTagReplacement, 'g'),
            () => {
              return existingClosingTags.shift()
            }
          )
          highlightedContent = highlightedContent.replace(
            new RegExp(encodedHtmlReplacement, 'g'),
            () => {
              return encodedHtml.shift()
            }
          )
        }
      }

      return highlightedContent
    }
  }
}
</script>
