var request = require('superagent')
var config = require('./config')

var getQueryString = function() {
  var qs = {};
  var splitQuery = window.location.search.split(/\?|&/).forEach(function(keyValuePair) {
    var keyAndValue = keyValuePair.split('=')
    qs[keyAndValue[0]] = keyAndValue[1]
  });
  return qs;
}

var handleNewAccountCreation = function() {
  var snippetEnvelope = document.getElementById('snippet-envelope');
  var snippetGenerator = document.getElementById('snippet-generator');
  var snippetGeneratorInputContainer = document.getElementById('snippet-generator-inputs');
  var snippetGeneratorEmail = document.getElementById('snippet-generator-email');
  var snippetGeneratorButton = document.getElementById('snippet-generator-button');

  var snippetDisplay = document.getElementById('snippet-display');
  var snippetDisplayUrl = document.getElementById('snippet-display-url')
  var snippetDisplayEmail = document.getElementById('snippet-display-email');
  var snippetDisplayToken = document.getElementById('snippet-display-token');

  if (!snippetGeneratorButton) {
    return;
  }

  snippetGeneratorButton.addEventListener('click', function() {
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(snippetGeneratorEmail.value)) {
      snippetGeneratorButton.blur(); // Prevents a bug in Chrome where animations don't work when button focussed.
      snippetGeneratorInputContainer.className += " shake error";
      setTimeout(function() {
        snippetGeneratorInputContainer.className = snippetGeneratorInputContainer.className.replace(" shake error", "");
      }, 1000);
      return;
    }

    snippetDisplayUrl.innerHTML = config.libraryUrl;
    snippetDisplayEmail.innerHTML = snippetGeneratorEmail.value;
    snippetDisplayToken.innerHTML = window.btoa(snippetGeneratorEmail.value);

    snippetEnvelope.className += " bounceOutDown";

    setTimeout(function() {
      snippetGenerator.style.display = "none";
      snippetDisplay.style.display = "block";
      snippetEnvelope.className = snippetEnvelope.className.replace("bounceOutDown", "bounceInUp");
    }, 1000)
  }, false);
}

var handleEmailVerification = function() {
  // Check whether any verification requests need to be made:
  var queryString = getQueryString()
  if (queryString.id && queryString.verificationToken) {
    request.post(config.verifyRecipientUrl)
      .send({
        id: queryString.id,
        verificationToken: queryString.verificationToken
      })
      .end(function(err, response) {
        if (err) {
          console.err('Error', err);
        }
        console.log('Success', response)
      })
  }
}

window.onload = function() {
  handleNewAccountCreation()
  handleEmailVerification()
}