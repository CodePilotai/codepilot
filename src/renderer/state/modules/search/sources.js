import flow from 'lodash/flow'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import detectLanguage from '@helpers/detect-language'

export default {
  localFiles: {
    active: process.env.LOCAL_ACTIVE,
    name: 'Local',
    label: 'Local Files Search',
    storeKey: 'localFiles',
    service: 'ripgrep',
    canLoadMoreResults: false,
    queryMapper: query => query,
    resultsMapper: flow(
      items => uniqBy(items, result => result.key.replace(/^[^:]+:/, '')),
      groupResultsByFile,
      items => sortBy(items, 'path')
    ),
    exactFilter: () => true
  },
  githubCode: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Code',
    label: 'GitHub Code Search',
    storeKey: 'githubCode',
    service: 'githubCode',
    canLoadMoreResults: true,
    queryMapper: query => query,
    resultsMapper: file => {
      return {
        ...file,
        branches: keyFileLines(file.lines),
        language: detectLanguage(file)
      }
    },
    exactFilter: (file, query) => file.body.includes(query.text)
  },
  personalRepos: {
    active: process.env.GITHUB_ACTIVE,
    name: 'Personal Repo',
    label: 'GitHub Personal Repository Search',
    storeKey: 'personalRepos',
    service: 'personalRepos',
    canLoadMoreResults: true,
    queryMapper: query => {
      const store = require('@state/store').default
      return {
        ...query,
        append: `user:${store.state.githubAuth.githubUserInfo.login}`
      }
    },
    resultsMapper: file => {
      return {
        ...file,
        source: 'Personal Repo',
        branches: keyFileLines(file.lines),
        language: detectLanguage(file)
      }
    },
    exactFilter: (file, query) => file.body.includes(query.text)
  },
  githubEnterprise: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Enterprise Code',
    label: 'GitHub Enterprise Code Search',
    storeKey: 'githubEnterpriseCode',
    service: 'githubEnterpriseCode',
    canLoadMoreResults: true,
    queryMapper: query => {
      const store = require('@state/store').default
      return {
        ...query,
        hostAddress: store.state.githubAuth.githubEnterpriseHostAddress
      }
    },
    resultsMapper: file => {
      return {
        ...file,
        source: 'GitHub Enterprise Code',
        branches: keyFileLines(file.lines),
        language: detectLanguage(file)
      }
    },
    exactFilter: (file, query) => file.body.includes(query.text)
  },
  markdownFiles: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Markdown',
    label: 'GitHub Markdown Search',
    storeKey: 'markdownFiles',
    service: 'githubCode',
    canLoadMoreResults: true,
    queryMapper: query => ({
      ...query,
      append: `extension:md filename:README path:/`
    }),
    resultsMapper: result => ({
      title: `${result.context.repo.owner.name}/${result.context.repo.name}`,
      source: 'GitHub Markdown',
      type: 'doc',
      key: result.path,
      repo: {
        ...result.context.repo,
        updatedAt: result.repo.updatedAt
      },
      url: result.context.html_url,
      path: result.relativePath,
      body: result.body,
      description: result.context.repo.description,
      branches: [
        {
          id: result.relativePath,
          key: result.path + result.relativePath,
          description: result.context.repo.description
        }
      ]
    }),
    exactFilter: (file, query) => file.body.includes(query.text)
  },
  stackoverflow: {
    active: process.env.STACKOVERFLOW_ACTIVE,
    name: 'Stack Overflow',
    label: 'Stack Overflow Search',
    storeKey: 'stackoverflow',
    service: 'stackoverflow',
    canLoadMoreResults: false,
    queryMapper: query => query,
    resultsMapper: questions =>
      questions.map(question => ({
        ...question,
        key: String(question.question_id),
        branches: [
          {
            ...question,
            key: String(question.question_id)
          }
        ]
      })),
    exactFilter: (question, query) => {
      return (
        question.body.includes(query.text) ||
        question.answers.some(answer => answer.body.includes(query.text))
      )
    }
  },
  githubIssues: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Issues',
    label: 'GitHub Issues Search',
    storeKey: 'githubIssues',
    service: 'githubIssues',
    canLoadMoreResults: true,
    queryMapper: query => query,
    resultsMapper: issue => ({
      ...issue,
      key: String(issue.id),
      branches: [
        {
          ...issue,
          key: String(issue.id)
        }
      ]
    }),
    exactFilter: (issue, query) => {
      return (
        issue.body.includes(query.text) ||
        issue.comments.some(comment => comment.body.includes(query.text))
      )
    }
  },
  githubPullRequest: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Pull Requests',
    label: 'GitHub Pull Requests Search',
    storeKey: 'githubPullRequest',
    service: 'githubPullRequest',
    canLoadMoreResults: true,
    queryMapper: query => query,
    resultsMapper: pr => ({
      ...pr,
      key: String(pr.id),
      branches: [
        {
          ...pr,
          key: String(pr.id)
        }
      ]
    }),
    exactFilter: (pr, query) => {
      return (
        pr.body.includes(query.text) ||
        pr.comments.some(comment => comment.body.includes(query.text))
      )
    }
  },
  githubCommit: {
    active: process.env.GITHUB_ACTIVE,
    name: 'GitHub Commits',
    label: 'GitHub Commits Search',
    storeKey: 'githubCommit',
    service: 'githubCommit',
    canLoadMoreResults: true,
    queryMapper: query => query,
    resultsMapper: commit => ({
      ...commit,
      key: commit.sha,
      branches: commit.files.map(file => {
        return {
          ...file,
          ...commit,
          key: file.sha + file.path + file.filename
        }
      })
    }),
    exactFilter: (commit, query) => commit.message.includes(query.text)
  },
  youtube: {
    active: process.env.YOUTUBE_ACTIVE,
    name: 'YouTube',
    label: 'YouTube Video Search',
    storeKey: 'youtube',
    service: 'youtube',
    canLoadMoreResults: false,
    queryMapper: query => query,
    resultsMapper: video => ({
      ...video,
      key: video.id,
      branches: [
        {
          ...video,
          key: video.id
        }
      ]
    }),
    exactFilter: (video, query) => {
      return (
        video.title.includes(query.text) ||
        video.description.includes(query.text)
      )
    }
  },
  searchcode: {
    active: process.env.SEARCHCODE_ACTIVE,
    name: 'Searchcode',
    label: 'Searchcode',
    storeKey: 'searchcode',
    service: 'searchcode',
    canLoadMoreResults: false,
    queryMapper: query => query,
    resultsMapper: file => ({
      ...file,
      branches: keyFileLines(file.lines)
    }),
    exactFilter: (file, query) => {
      return file.body.includes(query.text)
    }
  },
  createWebSource(name = 'google', label = 'Google') {
    const sourceName =
      {
        google: 'View Web Results',
        devdocs: 'DevDocs.io'
      }[name] || 'Custom Sources'

    return {
      active: true,
      name: sourceName,
      label: `${label} Search`,
      storeKey: name + 'Web',
      service: 'web',
      queryMapper: (query, state) => {
        const customSearchSources =
          {
            google: [{ isSearched: true, url: 'google.com' }],
            devdocs: [
              {
                isSearched: false,
                url: `https://devdocs.io/#q=${state.query.text}`
              }
            ]
          }[name] ||
          state.customSources.filter(source => source.intent.key === name)

        return {
          ...query,
          customSearchSources: customSearchSources.map(source => ({
            name: sourceName,
            ...source
          }))
        }
      },
      resultsMapper: website => ({
        ...website,
        branches: [
          {
            ...website
          }
        ]
      }),
      exactFilter: () => true
    }
  }
}

function groupResultsByFile(results) {
  const fileGroups = groupBy(results, 'file.path')
  return Object.keys(fileGroups).map(filePath => {
    const lineResults = fileGroups[filePath]
    const { file } = lineResults[0]
    const { baseDirectory, relativePath, source, context } = file
    return {
      type: 'file',
      key: filePath,
      title: filePath,
      body: lineResults.map(branch => branch.file.line.body).join('\n'),
      path: filePath,
      baseDirectory,
      relativePath,
      source,
      context,
      branches: lineResults,
      language: detectLanguage(file)
    }
  })
}

function keyFileLines(lines) {
  return lines.map(line => ({
    ...line,
    key:
      (line.file.localPath || line.file.path) +
      ':' +
      line.file.line.number +
      ':' +
      line.file.line.column
  }))
}
