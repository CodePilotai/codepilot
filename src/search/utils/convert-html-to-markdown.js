import { convert as htmlToMarkdown } from 'html-to-markdown'
import { AllHtmlEntities } from 'html-entities'

const entities = new AllHtmlEntities()

export default (body = '') => {
  const text = entities.decode(htmlToMarkdown(body))
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n(#+)(\w)/g, '\n$1 $2')
    .replace(/`<code>/g, '```\n')
    .replace(/<\/code>`/g, '```')
    .replace(/<\/?code>/g, '`')
    .replace(/<a[^>]*?href="([^"]+)"[^>]*?>(.+?)<\/a>/g, '[$2]($1)')
    .replace(/<hr>/g, '===')
}
