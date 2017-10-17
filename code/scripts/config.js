var config = module.exports

config.inStaging = !!window.location.search.match(/staging=/)
config.inDevelopment = window.location.port && window.location.hostname.match(/local/) && !config.inStaging
config.inProduction = !config.inStaging && !config.inDevelopment

var buildApiUrl = function(endpoint) {
  return config.protocol + '://' + config.apiHost + endpoint;
}

var buildAssetUrl = function(file) {
  return config.protocol + '://' + config.assetHost + file;
}

config.protocol = config.inDevelopment ? 'http' : 'https'
config.apiHost = config.inDevelopment ? 'localhost:8080' : (config.inStaging ? 'app-staging.howdyform.com' : 'app.howdyform.com')
config.assetHost = config.inDevelopment ? 'static.howdyform.com' : 'static.howdyform.com'
config.assetFileName = config.inStaging ? 'howdyClientStaging.js' : 'howdyClient.js'
config.stripeKey = (config.inDevelopment || config.inStaging) ? 'pk_test_6MCiAEXja5maiISN7W3cXjhP' : 'pk_live_COqrme9FBvt1ssbwvxEomd2I';
config.verifyRecipientUrl = buildApiUrl('/api/recipients/verify')
config.createAccountUrl = buildApiUrl('/api/accounts')
config.libraryUrl = buildAssetUrl('/howdyClient.js')
config.createSubscriptionUrl = buildApiUrl('/api/subscriptions')
config.updateSubscriptionUrl = buildApiUrl('/api/subscriptions/update')
