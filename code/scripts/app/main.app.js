window.onload = function() {

  var snippetEnvelope = document.getElementById('snippet-envelope');
  var snippetGenerator = document.getElementById('snippet-generator');
  var snippetDisplay = document.getElementById('snippet-display'); 

  var snippetGeneratorEmail = document.getElementById('snippet-generator-email');
  var snippetGeneratorButton = document.getElementById('snippet-generator-button');
  var snippetDisplayEmail = document.getElementById('snippet-display-email');

  snippetGeneratorButton.addEventListener('click', function() {
    snippetDisplayEmail.innerHTML = snippetGeneratorEmail.value;

    snippetEnvelope.className += " " + "bounceOutDown";

    setTimeout(function() {
      snippetGenerator.style.display = "none";
      snippetDisplay.style.display = "block";
      snippetEnvelope.className = snippetEnvelope.className.replace("bounceOutDown", "bounceInUp");
    }, 1000)


  }, false);
}