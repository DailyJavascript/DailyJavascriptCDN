//get html collection of input elements and convert into an array
new Array(...document.getElementsByTagName('input')).forEach(
  (emailInput) =>{
    emailInput.addEventListener("input", function (event) {
      console.log(emailInput.validity)
      if (emailInput.validity.patternMismatch) {
        emailInput.setCustomValidity("Email does not appear to be a valid email address");
      } else {
        emailInput.setCustomValidity("");
      }
    });
  }
)
