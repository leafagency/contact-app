var config = module.exports

var inDevelopment = window.location.port && window.location.hostname.match(/local/);

var buildApiUrl = function(endpoint) {
  return config.protocol + '://' + config.apiHost + endpoint;
}

config.protocol = inDevelopment ? 'http' : 'https'
config.apiHost = inDevelopment ? 'localhost:8080' : 'app.howdyform.com'
config.stripeKey = inDevelopment ? 'pk_test_6MCiAEXja5maiISN7W3cXjhP' : 'pk_live_COqrme9FBvt1ssbwvxEomd2I';

config.verifyRecipientUrl = buildApiUrl('/api/recipients/verify')
config.createAccountUrl = buildApiUrl('/api/accounts')
config.libraryUrl = buildApiUrl('/static/howdyClient.js')
config.createSubscriptionUrl = buildApiUrl('/api/subscriptions')
