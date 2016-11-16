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

    request.post(config.createAccountUrl)
      .send({
        email: snippetGeneratorEmail.value,
      })
      .end(function(err, response) {
        if (err) {
          console.error('Error', err);
          return;
        }

        snippetEnvelope.className += " bounceOutDown";

        setTimeout(function() {
          snippetGenerator.style.display = "none";
          snippetDisplay.style.display = "block";
          snippetEnvelope.className = snippetEnvelope.className.replace("bounceOutDown", "bounceInUp");
        }, 1000)
      })
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

var handleAccountCreation = function() {
  var queryString = getQueryString()

  if (window.$ && Stripe && queryString.id) {
    var $ = window.$
    Stripe.setPublishableKey('pk_test_6MCiAEXja5maiISN7W3cXjhP')
    var $form = $('#payment-form')
    $form.submit(function(event) {
      // Disable the submit button to prevent repeated clicks:
      $form.find('.submit').prop('disabled', true)

      // Request a token from Stripe:
      Stripe.card.createToken($form, function(status, response) {
        var $form = $('#payment-form')

        if (response.error) { // Problem!
          $form.find('.payment-errors').text(response.error.message)
          return $form.find('.submit').prop('disabled', false)
        }

        var stripePaymentToken = response.id
        var id = queryString.id

        request.post(config.verifyRecipientUrl)
          .send({
            id: queryString.id,
            verificationToken: queryString.verificationToken
          })
          .end(function(err, response) {
            if (err) {
              console.err('Error', err);
            }
            alert('Success!', response)
          })
      })

      // Prevent the form from being submitted:
      return false
    })
  }
}


window.onload = function() {
  handleNewAccountCreation()
  handleEmailVerification()
  handleAccountCreation()
}
