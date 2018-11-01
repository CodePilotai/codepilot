import { mapState, mapGetters, mapActions } from 'vuex'

export const searchGetters = {
  ...mapState({
    query: state => state.search.query,
    submittedQuery: state => state.search.submittedQuery,
    recentQueries: state => state.search.recentQueries,
    results: state => state.search.results,
    selectedSearchIntentKey: state =>
      state.search.query.selectedSearchIntentKey,
    searchErrors: state => state.search.errors,
    searchIntents: state => state.search.searchIntents,
    searchIsFullWindow: state => state.search.isFullWindow,
    searchPins: state => state.search.pins,
    githubResultsDependencies: state => state.search.githubResultsDependencies,
    resultsLicenses: state => state.search.resultsLicenses,
    shouldRankResults: state => state.search.shouldRankResults,
    allowResultsWithoutDeps: state => state.search.allowResultsWithoutDeps,
    requireAllDependenciesToBeFound: state =>
      state.search.requireAllDependenciesToBeFound,
    allowResultsWithoutLicense: state =>
      state.search.allowResultsWithoutLicense,
    selectedResult: state => state.search.selectedResult
  }),
  ...mapGetters([
    'matchingRecentQuery',
    'selectedBranch',
    'searchResults',
    'selectedTabSearchResults',
    'selectedTabSearchResultsUnfiltered',
    'searchResultsItemsGroups',
    'searchResultsItemsGroupsUnfiltered',
    'groupContainingSelectedResult',
    'searchStatus',
    'selectedSearchIntent',
    'filtersActive'
  ])
}

export const searchActions = mapActions([
  'selectResult',
  'selectSearchResult',
  'runSearch',
  'updateQuery',
  'updateSelectedSearchIntent',
  'updateSearchIsFullWindow',
  'updateQueryTypes',
  'updateSearchIntent',
  'updateResultsScores',
  'toggleExactFilter',
  'updateSourcesOrder',
  'saveSourceOrder',
  'getLocalPackageJsonData',
  'updateShouldRankResults',
  'updateGithubResultsDependencies',
  'updateResultsLicenses',
  'setGithubCodeDependencyChecked',
  'setLicenseFilterChecked',
  'updateResultsWithoutLicenses',
  'updateResultsWithoutDeps',
  'updateDependencyFilterRequirements',
  'initSelectedResultStream',
  'setCustomSources'
])

export const interfaceGetters = {
  ...mapState({
    screenResolution: state => state.interface.screenResolution,
    githubSignInModalShown: state => state.interface.githubSignInModalShown,
    githubEnterpriseSignInModalShown: state =>
      state.interface.githubEnterpriseSignInModalShown,
    githubEnterpriseInstructionsShown: state =>
      state.interface.githubEnterpriseInstructionsShown,
    appPinModalShown: state => state.interface.appPinModalShown,
    trialEndingModalShown: state => state.interface.trialEndingModalShown,
    rubberDuckModalShown: state => state.interface.rubberDuckModalShown,
    selectedProFeature: state => state.interface.selectedProFeature,
    sidebarWidth: state => state.interface.sidebar.width,
    sidebarAnimating: state => state.interface.sidebar.sidebarAnimating,
    sidebarTabs: state => state.interface.sidebar.tabs,
    sidebarActiveTab: state => state.interface.sidebar.activeTab,
    viewable: state => state.interface.viewable,
    codeFontSize: state => state.interface.codeFontSize,
    codeFontFamily: state => state.interface.codeFontFamily,
    currentThemeKey: state => state.interface.currentThemeKey,
    themes: state => state.interface.themes,
    zoomFactor: state => state.interface.zoomFactor,
    viewPaneState: state => state.interface.viewPaneState,
    minimapIsEnabled: state => state.interface.minimapIsEnabled
  }),
  ...mapGetters(['sidebarIsVisible', 'interfaceVariables'])
}

export const interfaceActions = mapActions([
  'updateGitHubSignInModalShown',
  'updateGitHubEnterpriseSignInModalShown',
  'updateGitHubEnterpriseInstructionsShown',
  'updateTrialEndingModalShown',
  'updateAppPinModalShown',
  'updateRubberDuckModalShown',
  'updateSidebarWidth',
  'toggleSidebarExpanded',
  'updateSidebarActiveTab',
  'updateViewable',
  'revertToPrevViewable',
  'revertToPrevSidebarWidth',
  'updateCodeFontSize',
  'updateCodeFontFamily',
  'updateTheme',
  'displayViewPaneSettings',
  'updateZoomFactor',
  'toggleView',
  'toggleMinimapEnabled',
  'updateViewPaneState',
  'detectScreenResolution'
])

export const notificationGetters = {
  ...mapState({
    all: state => state.notifications.all
  }),
  ...mapGetters(['currentNotification'])
}

export const notificationActions = mapActions([
  'initNotifications',
  'addNotification',
  'dismissNotification',
  'clearNotifications',
  'blacklistNotification'
])

export const shortcutGetters = {
  ...mapState({
    toggleAppFocusShortcut: state => state.shortcuts.global.toggleAppFocus
  })
}

export const shortcutActions = mapActions([
  'initShortcuts',
  'updateToggleAppFocusShortcut'
])

export const osIntegrationGetters = {
  ...mapState({
    launchOnStartup: state => state.osIntegrations.launchOnStartup,
    commentCodeOnCopy: state => state.osIntegrations.commentCodeOnCopy
  })
}

export const osIntegrationActions = mapActions([
  'initOsIntegrations',
  'updateLaunchOnStartup',
  'updateCommentCodeOnCopy'
])

export const githubAuthGetters = {
  ...mapState({
    githubAccessToken: state => state.githubAuth.githubAccessToken,
    githubEnterpriseAccessToken: state =>
      state.githubAuth.githubEnterpriseToken,
    githubEnterpriseHostAddress: state =>
      state.githubAuth.githubEnterpriseHostAddress,
    githubEnterpriseHostAddressValidated: state =>
      state.githubAuth.githubEnterpriseHostAddressValidated,
    githubUserInfo: state => state.githubAuth.githubUserInfo,
    githubEnterpriseUserInfo: state =>
      state.githubAuth.githubEnterpriseUserInfo,
    userChoseToDisableGitHub: state =>
      state.githubAuth.userChoseToDisableGitHub,
    rateLimits: state => state.githubAuth.limits,
    signInLoading: state => state.githubAuth.loading
  })
}

export const githubAuthActions = mapActions([
  'initGithubUserInfo',
  'getCurrentAuthenticatedUser',
  'revokeGithubAccess',
  'githubBasicSignIn',
  'githubEnterpriseBasicSignIn',
  'githubBrowserSignIn',
  'getRemainingRateLimits',
  'updateGitHubEntepriseHostAddress',
  'updateGitHubEnterpriseHostAddressValidated',
  'updateGitHubEnterprisePersonalAccessToken',
  'updateGitHubEnterpriseUserInfo'
])

export const onboardingGetters = {
  ...mapState({
    currentOnboardingStage: state => state.onboarding.currentStage,
    customerChoseToGoPro: state => state.onboarding.customerChoseToGoPro
  }),
  ...mapGetters([
    'currentOnboardingStageIndex',
    'prevOnboardingStage',
    'nextOnboardingStage',
    'onboardingIsComplete',
    'onboardingPages'
  ])
}

export const onboardingActions = mapActions([
  'updateOnboardingStage',
  'updateCustomerChoseToGoPro'
])

export const editorGetters = {
  ...mapState({
    editorFocused: state => state.editor.focused,
    editorIsWordWrap: state => state.editor.isWordWrap
  })
}

export const editorActions = mapActions([
  'updateEditor',
  'updateEditorWordWrap',
  'editorCenter',
  'editorMoveCursor',
  'editorSelect',
  'editorHighlight',
  'editorBlur',
  'editorFocus',
  'editorNextTick'
])

export const internetConnectionGetters = {
  ...mapState({
    hasInternetConnection: state =>
      state.internetConnection.hasInternetConnection
  })
}

export const internetConnectionActions = mapActions([
  'initInternetConnectionChecker'
])

export const userProfileGetters = {
  ...mapState({
    profiles: state => state.userProfile.profiles,
    isEditingTemporaryProfile: state =>
      state.userProfile.isEditingTemporaryProfile,
    temporaryProfile: state => state.userProfile.temporaryProfile,
    userProfileMultiselectOptions: state =>
      state.userProfile.userProfileMultiselectOptions
  }),
  ...mapGetters([
    'selectedProfile',
    'devdocsList',
    'suggestedDocsForProfile',
    'selectedProfileDocs'
  ])
}

export const userProfileActions = mapActions([
  'initUserProfiles',
  'updateUserProfile',
  'updateUserOSAndTimezone',
  'setNewProfileCreation',
  'saveTemporaryProfile',
  'deleteCurrentProfile',
  'selectProfile',
  'addCustomOptionAndSelect'
])

export const customSearchSourcesGetters = {
  ...mapState({
    availableCustomSearchSources: state =>
      state.customSearchSources.availableCustomSearchSources,
    userAddedCustomSources: state =>
      state.customSearchSources.userAddedCustomSources,
    shouldFilterByTag: state => state.customSearchSources.shouldFilterByTag
  }),
  ...mapGetters([
    'filteredAvailableCustomSearchSources',
    'showfilteredAvailableCustomSearchSourcesCount'
  ])
}

export const customSearchSourcesActions = mapActions([
  'toggleFilterByTag',
  'addEmptyCustomSource',
  'addFromAvailableCustomSearchSources',
  'updateCustomSource',
  'removeCustomSource',
  'resetCustomSources',
  'reinitializeCustomSources',
  'setCustomSourceTagsFromUserProfile'
])

export const tutorialsGetters = {
  ...mapState({
    tutorialsCompleted: state => state.tutorials.tutorialsCompleted
  })
}

export const tutorialsActions = mapActions([
  'resetTutorials',
  'setTutorialStatus'
])

export const pinsGetters = {
  ...mapState({
    pinnedResults: state => state.pins.results,
    currentSelectedPinResult: state => state.pins.currentSelectedPinResult,
    rubberDuckSessions: state => state.pins.rubberDuckSessions
  }),
  ...mapGetters([
    'pinnedResultsGroups',
    'currentRubberDuckSession',
    'currentGroupsNote'
  ])
}

export const pinsActions = mapActions([
  'addResultPin',
  'removeResultPin',
  'updateResultPin',
  'updateCurrentSelectedPinResult',
  'removePinGroup',
  'updateCurrentRubberDuckSessionField',
  'createNewRubberDuckSession',
  'updateCurrentRubberDuckSessionKey',
  'deleteRubberDuckSession',
  'createOrViewExistingPinGroupNote',
  'updateCurrentGroupsNoteBody',
  'deleteGroupsNote'
])

// chat
// export const chatGetters = {
//   ...mapState({
//     chats: state => state.chat.chats,
//     chatUser: state => state.chat.user,
//     chatMessages: state => state.chat.chatMessages,
//     currentChatChannel: state => state.chat.currentChannel,
//     isChatOpen: state => state.chat.isChatOpen,
//     ChatEngine: state => state.chat.ChatEngine[0],
//     isChatLoading: state => state.chat.loading,
//     currentChatView: state => state.chat.currentChatView
//   }),
//   ...mapGetters(['allUnnreadMessages', 'ChatEngine'])
// }
//
// export const chatActions = {
//   ...mapActions([
//     'sendChatMessage',
//     'updateCurrentChatChannel',
//     'createChatUser',
//     'markChatChannelAsRead',
//     'updateChatOpenStatus',
//     'createChatAndSubscribe',
//     'startChat',
//     'inviteToChat',
//     'removeChatChannel',
//     'updateChatView'
//   ])
// }
