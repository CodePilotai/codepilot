import convertHtmlToMarkdown from '../utils/convert-html-to-markdown'

// Create a map function by providing the list of accepted answers
// that applies the required spec for a question and connects the answer
export default function createQuestionMapper(answers) {
  return question => {
    return {
      ...question,
      source: 'Stack Overflow',
      type: 'question',
      // Normalize the title of each question to remove
      // HTML encodings.
      title: convertHtmlToMarkdown(question.title),
      answers: answers
        // Filter only answers this question
        .filter(answer => answer.question_id === question.question_id)
        .map(answer => {
          answer.owner.display_name = convertHtmlToMarkdown(
            answer.owner.display_name
          )
          answer.formattedBody = convertHtmlToMarkdown(answer.body)

          return answer
        }),
      formattedBody: convertHtmlToMarkdown(question.body)
    }
  }
}
