window.onload = function() {

  var snippetEnvelope = document.getElementById('snippet-envelope');
  var snippetGenerator = document.getElementById('snippet-generator');
  var snippetGeneratorInputContainer = document.getElementById('snippet-generator-inputs');
  var snippetDisplay = document.getElementById('snippet-display');

  var snippetGeneratorEmail = document.getElementById('snippet-generator-email');
  var snippetGeneratorButton = document.getElementById('snippet-generator-button');
  var snippetDisplayEmail = document.getElementById('snippet-display-email');

  snippetGeneratorButton.addEventListener('click', function() {

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(snippetGeneratorEmail.value)) {
      snippetGeneratorButton.blur(); // Prevents a bug in Chrome where animations don't work when button focussed.
      snippetGeneratorInputContainer.className += " shake error";
      setTimeout(function() {
        snippetGeneratorInputContainer.className = snippetGeneratorInputContainer.className.replace(" shake error", "");
      }, 1000);
      return;
    }

    var base64Email = window.btoa(unescape(encodeURIComponent(snippetGeneratorEmail.value)));

    snippetDisplayEmail.innerHTML = base64Email;

    snippetEnvelope.className += " bounceOutDown";

    setTimeout(function() {
      snippetGenerator.style.display = "none";
      snippetDisplay.style.display = "block";
      snippetEnvelope.className = snippetEnvelope.className.replace("bounceOutDown", "bounceInUp");
    }, 1000)


  }, false);
}