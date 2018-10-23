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

function preflight(emailInputID) {
  var email = document.getElementById(emailInputID).value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        console.log(response);
        if (response == "proceed") SignUpFree(email);
        return true;
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("GET","https://dailyjavascript.herokuapp.com/users/preflight",true);
  xhttp.send();
  return false;
} // end function SignUpFree(emailInput)

function SignUpFree(email) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&membershipLevel=free");
} // end function SignUpFree(emailInput)