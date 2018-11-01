import splitTest from './_split-test'

export default splitTest({
  key: __filename,
  hypotheses: {
    'Longer text': {
      instructions: `
        <p>Ever find yourself looking for code you wrote before?</p>
        <p>You can search code in your local folders including cloned repos.</p>
        <p>None of your code leaves your computer and we do not slow you down with indexing.</p>
        <p>Tip: Choose the folder that contains all your code projects.</p>
        <p>Tip: Clone projects that you want to search locally.</p>
      `,
      buttonText: 'Select my local code folder'
    },
    'Shorter text': {
      instructions: `
      <p>You can search code in your local folders including cloned repos.</p>
      <p>None of your code leaves your computer and we do not slow you down with indexing.</p>
      `,
      buttonText: 'Select local code folder'
    }
  }
})
