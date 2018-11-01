module.exports = ({ electron }) => {
  electron.dialog.showOpenDialog = (options, callback) => {
    if (options.title === 'Select a folder to search') {
      callback([
        process.env.E2E_SEARCH_PATH ||
          'YOU MUST MOCK THE SEARCH FOLDER BY SETTING process.env.E2E_SEARCH_PATH'
      ])
    }
  }
}
