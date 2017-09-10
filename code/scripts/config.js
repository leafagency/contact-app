var inStaging = window.location.search.match(/staging=/)
var inDevelopment = window.location.port && window.location.hostname.match(/local/) && !inStaging
var inProduction = !inStaging && !inDevelopment

var buildApiUrl = function(endpoint) {
  return config.protocol + '://' + config.apiHost + endpoint;
}

var buildAssetUrl = function(file) {
  return config.protocol + '://' + config.assetHost + file;
}

var config = module.exports
config.protocol = inDevelopment ? 'http' : 'https'
config.apiHost = inDevelopment ? 'localhost:8080' : (inStaging ? 'app-staging.howdyform.com' : 'app.howdyform.com')
config.assetHost = inDevelopment ? 'static.howdyform.com' : 'static.howdyform.com'
config.stripeKey = (inDevelopment || inStaging) ? 'pk_test_6MCiAEXja5maiISN7W3cXjhP' : 'pk_live_COqrme9FBvt1ssbwvxEomd2I';
config.verifyRecipientUrl = buildApiUrl('/api/recipients/verify')
config.createAccountUrl = buildApiUrl('/api/accounts')
config.libraryUrl = buildAssetUrl('/howdyClient.js')
config.createSubscriptionUrl = buildApiUrl('/api/subscriptions')
