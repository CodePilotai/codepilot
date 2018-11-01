const youtube = {
  active: true,
  key:
    process.env.PROJECT_PHASE === 'production'
      ? // Enable Youtube Data API v3 and create a key for an application here:
        // https://console.cloud.google.com/apis/library?q=youtube
        '"ENTER PROD YOUTUBE KEY HERE"'
      : '"AIzaSyAOQC70vYQ73hiiLhdvsalnjylQMcvul7E"'
}

const stackoverflow = {
  active: true,
  key:
    process.env.PROJECT_PHASE === 'production'
      ? // Register for an application key here:
        // https://stackapps.com/apps/oauth/register
        '"ENTER PROD STACKOVERFLOW KEY HERE"'
      : '"qtriVHDuZeTTk4aWTnol7Q(("'
}

const github = {
  active: true,
  client:
    process.env.PROJECT_PHASE === 'production'
      ? // Create a new OAuth app here:
        // https://github.com/settings/applications/new
        '"ENTER PROD CLIENT ID HERE"'
      : '"ad4f50c8dee3137df0d3"',
  secret:
    process.env.PROJECT_PHASE === 'production'
      ? // Create a new OAuth app here:
        // https://github.com/settings/applications/new
        '"ENTER PROD CLIENT SECRET HERE"'
      : '"d74b4b74e8f8d9b838ea68698a566428e2c08738"'
}

const ranker = {
  active: false
}

const searchcode = {
  active: true
}

const local = {
  active: true
}

module.exports = {
  youtube,
  stackoverflow,
  github,
  searchcode,
  local,
  ranker
}
