import sources from './sources'
import {
  createDependencyFilter,
  createIncludeExcludeFilter,
  createExactMatchFilter,
  createLicenseFilter
} from './utils/filters'

const intents = [
  {
    key: 'codeResults',
    name: 'Code',
    secondaryLabel: 'Code examples',
    sources: getActiveSources([
      sources.createWebSource('codeResults', 'Custom Code'),
      sources.localFiles,
      sources.personalRepos,
      sources.githubCode,
      sources.githubCommit,
      sources.githubEnterprise,
      sources.searchcode,
      sources.createWebSource()
    ]),
    filters: Object.freeze([
      createExactMatchFilter({ ignoreServices: ['web', 'githubCommit'] }),
      createIncludeExcludeFilter({ ignoreServices: ['web', 'githubCommit'] }),
      createLicenseFilter({
        ignoreServices: ['ripgrep', 'web', 'githubCommit']
      }),
      createDependencyFilter({ ignoreServices: ['ripgrep', 'web'] })
    ])
  },
  {
    key: 'learnResults',
    name: 'Learn',
    secondaryLabel: 'Something to Learn',
    sources: getActiveSources([
      sources.createWebSource('learnResults', 'Custom Learning'),
      sources.stackoverflow,
      sources.githubCommit,
      sources.githubPullRequest,
      sources.youtube,
      sources.createWebSource()
    ]),
    filters: Object.freeze([
      createExactMatchFilter({ ignoreServices: ['web', 'githubCommit'] }),
      createDependencyFilter({
        ignoreServices: ['stackoverflow', 'web', 'youtube']
      })
    ])
  },
  {
    key: 'errorResults',
    name: 'Errors',
    secondaryLabel: 'Solutions to Errors',
    sources: getActiveSources([
      sources.createWebSource('errorResults', 'Custom Errors'),
      sources.githubIssues,
      sources.stackoverflow,
      sources.githubCommit,
      sources.createWebSource()
    ]),
    filters: Object.freeze([
      createExactMatchFilter({ ignoreServices: ['web', 'githubCommit'] }),
      createDependencyFilter({ ignoreServices: ['stackoverflow', 'web'] })
    ])
  },
  {
    key: 'docsResults',
    name: 'Docs',
    secondaryLabel: 'Documentation',
    sources: getActiveSources([
      sources.createWebSource('devdocs', 'DevDocs.io'),
      sources.createWebSource('docsResults', 'Custom Docs'),
      sources.markdownFiles,
      sources.createWebSource()
    ]),
    filters: Object.freeze([
      createExactMatchFilter({ ignoreServices: ['web', 'githubCommit'] })
    ])
  }
]

function getActiveSources(sourcesList) {
  return sourcesList.filter(source => source.active)
}

for (const intent of intents) {
  for (const intentFilter of intent.filters) {
    intentFilter.onUpdate = (newValue, store) => {
      store.commit('SET_SEARCH_INTENT_FILTER', {
        intentKey: intent.key,
        filterLabel: intentFilter.label,
        newValue
      })
    }
  }
}

export default intents
