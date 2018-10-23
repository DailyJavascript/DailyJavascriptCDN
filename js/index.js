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

function SignUpFree(emailInput) {
  var email = document.getElementById(emailInput).value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send("email="+email);
} // end function SignUpFree(emailInput)