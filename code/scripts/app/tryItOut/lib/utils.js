const utils = module.exports = {
  forEachChild: function(domElement, callback) {
    var results = [];
    for (var i=0; i < domElement.children.length; i++ ) {
      var childElement = domElement.children[i];
      results.push(callback(childElement));

      if (childElement.children && childElement.children.length) {
        var recursiveResults = utils.forEachChild(childElement, callback)
        results = results.concat(recursiveResults);
      }
    }
    return results;
  },
  getFormElement: function(contactFormClass) {
    var classNameMatches = document.getElementsByClassName(contactFormClass);

    if (classNameMatches.length) {
      return classNameMatches[0];
    }

    var formElements = document.getElementsByTagName("form");

    if (formElements.length === 1) {
      return formElements[0];
    }

    if (formElements.length > 1) {
      alert("Howdy found more than one form on the page, please add a class of '"+ contactFormClass +"' to the one you want to use.");
      return;
    }

    alert("Howdy couldn't find any form elements on the page to use. Please add a form to the page to use Howdy.");
  },
  getEnvironment: function() {
    var url = utils.currentScript().src

    if (/app\.howdyform\.com/.test(url)) {
      return 'production'
    }

    if (/app-staging\.howdyform\.com/.test(url)) {
      return 'staging'
    }

    return 'development'
  },
  currentScript: function() {
    if (document.currentScript) {
      return document.currentScript;
    }

    // This is an IE fallback, we can drop it when we drop IE support:
    var scripts = document.getElementsByTagName('script');
    var script = null;
    for (var i = 0; i < scripts.length; i++) {
      if (/howdy/.test(scripts[i].src)) {
        script = scripts[i];
        break;
      }
    }
    return script;
  }
};
