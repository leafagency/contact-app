var request = require('superagent');
require('./contactFormHandler/lib/xhr-xdr-adapter'); // Allows superagent to work on IE9

var CONTACT_FORM_ID = "leaf-hello";

var utils = {
  forEachChild: function(domElement, callback) {
    var results = [];
    for (var i=0; i < domElement.children.length; i++ ) {
      results.push(callback(domElement.children[i]));
    }
    return results;
  },
  getFormElement: function() {
    return document.getElementById(CONTACT_FORM_ID);
  }
}

var attachHandler = function(options) {
  var validations = options.validations || {};
  var postSendHook = options.postSendHook || (function() {});

  var requestData = {};

  var findInputForName = function(name) {
    var result = null;

    utils.forEachChild(utils.getFormElement(), function(childEl) {
      if (childEl.getAttribute('name') == name) {
        result = childEl;
      }
    });

    return result;
  }

  var isScrapeableInputElement = function(inputElement) {
    return !!(inputElement.name);
  }

  var clientValidate = function(domElement) {
    if (Object.keys(validations).indexOf(domElement.name) !== -1) {
      var message = validations[domElement.name](domElement);
      if (message) {
        addError(domElement, message);
        return message;
      }
    }
    return null;
  }

  var scrapeForData = function(domElement) {
    if (isScrapeableInputElement(domElement)) {
      requestData[domElement.name] = domElement.value;
    }
  };

  var clearFields = function() {
    utils.forEachChild(utils.getFormElement(), function(childEl) {
      if (childEl.getAttribute('name')) childEl.value = '';
    });
  };

  var clearErrors = function() {
    utils.forEachChild(utils.getFormElement(), function(childEl) {
      if (childEl.getAttribute('name') && /erroneous/.test(childEl.className)) {
        clearError(childEl);
      }
    });
  };

  var clearError = function(focusEvent) {
    var domEl = focusEvent.target;
    domEl.className = domEl.className.replace(/\berroneous\b/,'');
    domEl.parentNode.removeChild(domEl.nextSibling);
  }

  var addError = function(domEl, message) {
    if (/erroneous/.test(domEl.className)) {
      return;
    }

    var errorEl = document.createElement("SPAN");
    errorEl.className = "error";
    domEl.className += " erroneous";
    errorEl.appendChild(document.createTextNode(message));
    domEl.parentNode.insertBefore(errorEl, domEl.nextSibling);

    domEl.addEventListener('focus', clearError);
  };

  var showErrors = function(errors) {
    for (var key in errors) {
      var domEl = findInputForName(key);
      if (domEl) {
        addError(domEl, errors[key]);
      }
    }
  }

  var handleSendEmailResponse = function(err, response) {
    if (err) {
      return showErrors(err.response.body.errors);
    }

    clearErrors();
    clearFields();

    postSendHook();
  };

  var prepareMessage = function(requestData) {
    var messageBody = [
      'Hi there,\n\n',
      'You have a new message from your contact form:\n\n',
    ];

    for (var key in requestData) {
      var value = requestData[key];
      if (key) {
        messageBody.push(key + ": " + (value || '[not supplied]') + "\n");
      }
    }

    messageBody = messageBody.concat([
      "\n",
      "Thanks,\n\n",
      "- The Leaf Team"
    ]);

    return messageBody.join("");
  }

  var onFormSubmit = function(submitEvent) {
    submitEvent.preventDefault();

    var errorStrings = utils.forEachChild(utils.getFormElement(), clientValidate);
    if (errorStrings.join('').length) {
      return;
    }
    
    utils.forEachChild(utils.getFormElement(), scrapeForData);
    var messageBody = prepareMessage(requestData);
    
    request.post('http://leaf-staging.herokuapp.com/v1/contact')
      .send({
        message: {
          email: 'mike@mcarter.me',
          subject: 'New contact from Mike',
          body: messageBody
        }
      })
      .end(handleSendEmailResponse);
  };

  window.onload = function() {
    var formElement = document.getElementById(CONTACT_FORM_ID);

    if (!formElement) {
      throw new Error("No form element with an id of '"+ CONTACT_FORM_ID +"' was found, so contact app couldn't start.");
    }

    formElement.addEventListener('submit', onFormSubmit);
  };
};


attachHandler({
  validations: {
    // name: function(input) {
    //   if (!input.value) return "Must be provided."
    // },
    // email: function(input) {
    //   if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(input.value)) return "Must be a valid email.";
    // },
    // body: function(input) {
    //   if (!input.value) return "Must be provided.";
    // }
  },
  postSendHook: function() {
    alert("Thanks, we've received your message and will get back to you shortly.");
  }
});