import Vue from 'vue'
import settings from 'electron-settings'
import DEVDOCS_DOCS from './user-profile-devdocs.json'

const userProfileMultiselectOptions = {
  xaas: [
    'Amazon EC2',
    'Windows Azure',
    'Google Compute Engine',
    'Digital Ocean',
    'Heroku',
    'Vltr',
    'Stripe',
    'SendGrid',
    'Mailgun',
    'Others'
  ],
  appServers: [
    'Phusion Passenger',
    'Thin',
    'Unicorn',
    'Puma',
    'Raptor',
    'Apache Tomcat',
    'JBoss',
    'Wildfly',
    'Glassfish',
    'Weblogic',
    'Others',
    'Node.js',
    'Nginx',
    'Oracle WebLogic',
    'Others'
  ],
  databases: [
    'PostgreSQL',
    'MariaDB',
    'SQLite',
    'Oracle',
    'MongoDB',
    'Others',
    'MSSQL',
    'Redis',
    'Others'
  ],
  testingTools: [
    'Selenium',
    'Apache JMeter',
    'BrowserStack',
    'Sauce Labs',
    'Rspec',
    'test-unit',
    'MiniTest',
    'Capybara',
    'FactoryGirl',
    'Jasmine',
    'Mocha',
    'AVA',
    'Jest',
    'Tape',
    'Genymotion',
    'Others'
  ],
  frameworks: [
    'Django',
    'Flask',
    'Express',
    'Ruby on Rails',
    'ASP.NET',
    'Mojolicious',
    'Angular',
    'React',
    'Vue.js',
    'Yii',
    'Meteor JS',
    'Ember',
    'Laravel',
    'Grails',
    'Spring',
    'Others'
  ],
  ide: [
    'Visual Studio',
    'Visual Studio Code (VSCode)',
    'Eclipse',
    'Android Studio',
    'NetBeans',
    'IntelliJ',
    'Sublime Text',
    'Atom	',
    'pyCharm',
    'Xcode	',
    'Code::Blocks',
    'Vim',
    'Xamarin',
    'PhpStorm',
    'Komodo',
    'Qt Creator',
    'Emacs',
    'JDeveloper',
    'geany',
    'Aptana',
    'MonoDevelop',
    'JCreator',
    'RubyMine',
    'Light Table',
    'SharpDevelop',
    'Eric Python',
    'DrJava',
    'Zend Studio',
    'Coda 2',
    'Brackets',
    'Others'
  ],
  programmingLanguages: [
    'C',
    'C#',
    'C++',
    'CSS',
    'F#',
    'Go',
    'Groovy',
    'HTML',
    'Java',
    'JavaScript',
    'PHP',
    'Perl',
    'Python',
    'R',
    'Ruby',
    'SQL',
    'Scala',
    'Swift',
    'TypeScript',
    'Visual Basic',
    'Others'
  ]
}

const DEFAULT_PROFILE_1 = {
  key: 'Javascript Developer',
  primaryLanguage: '',
  secondaryLanguage: '',
  os: '',
  ide: ['Visual Studio Code (VSCode)'],
  programmingLanguages: ['JavaScript', 'HTML', 'CSS'],
  frameworks: ['Vue.js'],
  testingTools: ['Jest', 'Mocha'],
  databases: ['MongoDB'],
  appServers: ['Node.js'],
  xaas: ['Stripe', 'SendGrid', 'Amazon EC2'],
  timezone: '',
  docs: ['javascript', 'html', 'dom', 'css', 'node'],
  customSources: []
}

const DEFAULT_PROFILE_2 = {
  key: 'Java Developer',
  primaryLanguage: '',
  secondaryLanguage: '',
  os: '',
  ide: ['IntelliJ'],
  programmingLanguages: ['Java', 'Groovy'],
  frameworks: ['Grails'],
  testingTools: ['Others'],
  databases: ['Oracle'],
  appServers: [],
  xaas: [],
  timezone: '',
  docs: [],
  customSources: []
}

const DEFAULT_PROFILE_3 = {
  key: 'Android Developer',
  primaryLanguage: '',
  secondaryLanguage: '',
  os: '',
  ide: ['Android Studio', 'Eclipse'],
  programmingLanguages: ['Java'],
  frameworks: [],
  testingTools: ['Genymotion'],
  databases: [],
  appServers: [],
  xaas: ['Others'],
  timezone: '',
  docs: ['kotlin'],
  customSources: []
}

const EMPTY_PROFILE = {
  key: 'Default Profile',
  primaryLanguage: '',
  secondaryLanguage: '',
  os: '',
  ide: [],
  programmingLanguages: [],
  frameworks: [],
  testingTools: [],
  databases: [],
  appServers: [],
  xaas: [],
  timezone: '',
  docs: [],
  customSources: []
}

export default {
  state: {
    selectedProfileIndex: settings.get('lastUsedProfileIndex') || 0,
    profiles: [],
    temporaryProfile: null,
    isEditingTemporaryProfile: false,
    userProfileMultiselectOptions
  },
  getters: {
    selectedProfile: state => {
      if (state.isEditingTemporaryProfile) {
        return state.temporaryProfile
      } else {
        return state.profiles[state.selectedProfileIndex]
      }
    },
    devdocsList: () => {
      return DEVDOCS_DOCS
    },
    suggestedDocsForProfile: (state, getters) => {
      const userSelections = []
        .concat(
          getters.selectedProfile.programmingLanguages,
          getters.selectedProfile.frameworks,
          getters.selectedProfile.testingTools
        )
        .map(
          userSelection =>
            userSelection
              .toLowerCase()
              .replace(/\+/g, 'p')
              .split('.')[0]
        )

      return getters.devdocsList.filter(devdoc =>
        userSelections.includes(devdoc.split('@')[0].toLowerCase())
      )
    },
    selectedProfileDocs(state, getters) {
      return getters.selectedProfile.docs.length
        ? getters.selectedProfile.docs
        : getters.suggestedDocsForProfile
    }
  },
  mutations: {
    UPDATE_SELECTED_USER_PROFILE(state, { changes, index }) {
      Vue.set(state.profiles, index, {
        ...state.profiles[index],
        ...changes
      })
    },
    UPDATE_TEMPORARY_PROFILE(state, profile) {
      state.temporaryProfile = {
        ...state.temporaryProfile,
        ...profile
      }
    },
    SELECT_ACTIVE_PROFILE(state, profileIndex) {
      state.selectedProfileIndex = profileIndex
      settings.set('lastUsedProfileIndex', profileIndex)
    },
    CREATE_NEW_PROFILE(state) {
      state.temporaryProfile = {
        ...state.profiles[0],
        key: 'New Profile'
      }
    },
    SET_TEMPORARY_PROFILE_EDITING(state, isEditing) {
      state.isEditingTemporaryProfile = isEditing
    },
    RESET_TEMPORARY_PROFILE(state) {
      state.temporaryProfile = {
        ...EMPTY_PROFILE
      }
    },
    SAVE_TEMPORARY_PROFILE(state) {
      state.profiles.push({
        ...state.temporaryProfile
      })
    },
    REMOVE_PROFILE(state, profileIndex) {
      state.profiles.splice(profileIndex, 1)
    },
    ADD_OPTION_TO_COLLECTION(state, { option, collection }) {
      state.userProfileMultiselectOptions[collection].push(option)
    },
    SET_USER_PROFILES(state, newValue) {
      state.profiles = newValue
    }
  },
  actions: {
    initUserProfiles({ state, commit }) {
      // Try to load user profiles as we normally would
      let profiles = settings.get('userProfiles') || [
        settings.get('userProfile')
          ? {
              ...EMPTY_PROFILE,
              ...settings.get('userProfile')
            }
          : { ...EMPTY_PROFILE },
        { ...DEFAULT_PROFILE_1 },
        { ...DEFAULT_PROFILE_2 },
        { ...DEFAULT_PROFILE_3 }
      ]

      // Ensure that we never end up with an empty array of profiles
      // if none exist already
      if (!profiles.length) {
        profiles.push({
          ...EMPTY_PROFILE
        })
      }

      // Iterate over all of our profiles and validate that they have
      // the properties that we want. If not then set them to the ones
      // we have set in EMPTY_PROFILE.
      profiles = profiles.map(profile => {
        Object.keys(EMPTY_PROFILE).map(property => {
          if (profile[property] === undefined) {
            profile[property] = EMPTY_PROFILE[property]
          }
        })
        return profile
      })

      commit('SET_USER_PROFILES', profiles)
    },
    updateUserProfile({ state, commit }, userProfileChanges) {
      if (state.isEditingTemporaryProfile) {
        commit('UPDATE_TEMPORARY_PROFILE', userProfileChanges)
      } else {
        commit('UPDATE_SELECTED_USER_PROFILE', {
          changes: userProfileChanges,
          index: state.selectedProfileIndex
        })
      }

      settings.set('userProfiles', state.profiles)
    },
    updateAllUserProfiles({ state, commit }, changes) {
      state.profiles.forEach((profile, index) => {
        commit('UPDATE_SELECTED_USER_PROFILE', {
          changes,
          index
        })
      })

      settings.set('userProfiles', state.profiles)
    },
    selectProfile({ commit, rootState, dispatch }, profileIndex) {
      commit('SELECT_ACTIVE_PROFILE', profileIndex)
      // If we are not in settings (we selected a profile while changing
      // settings) then run a new search upon selecting a new profile.
      if (rootState.interface.viewable.type !== 'settings') {
        dispatch('runSearch')
      }
    },
    setNewProfileCreation({ state, commit, dispatch }, isCreating) {
      if (isCreating) {
        commit('CREATE_NEW_PROFILE')
        dispatch('updateUserOSAndTimezone')
        commit('SET_TEMPORARY_PROFILE_EDITING', true)
      } else {
        commit('SET_TEMPORARY_PROFILE_EDITING', false)
        commit('RESET_TEMPORARY_PROFILE')
      }
    },
    saveTemporaryProfile({ state, commit }) {
      commit('SAVE_TEMPORARY_PROFILE')
      commit('RESET_TEMPORARY_PROFILE')
      commit('SET_TEMPORARY_PROFILE_EDITING', false)
      settings.set('userProfiles', state.profiles)
    },
    deleteCurrentProfile({ state, commit, dispatch }) {
      commit('REMOVE_PROFILE', state.selectedProfileIndex)
      dispatch('selectProfile', 0)
      settings.set('userProfiles', state.profiles)
    },
    updateUserOSAndTimezone: ({ dispatch }) => {
      const os = {
        distro: process.platform,
        arch: process.arch
      }
      dispatch('updateAllUserProfiles', { os })
    },
    addCustomOptionAndSelect(
      { state, commit, dispatch },
      { option, collection }
    ) {
      commit('ADD_OPTION_TO_COLLECTION', {
        option,
        collection
      })
      const currentlyEditedProfile = state.isEditingTemporaryProfile
        ? state.temporaryProfile
        : state.profiles[state.selectedProfileIndex]

      const changes = {
        ...currentlyEditedProfile,
        [collection]: currentlyEditedProfile[collection].concat([option])
      }

      dispatch('updateUserProfile', changes)
    }
  }
}
