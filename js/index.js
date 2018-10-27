//get html collection of input elements and convert into an array
new Array(...document.getElementsByTagName('input')).forEach(
  (emailInput) =>{
    emailInput.addEventListener("input", function () {
      if (emailInput.validity.patternMismatch) {
        emailInput.setCustomValidity("Email does not appear to be a valid email address");
      } else {
        emailInput.setCustomValidity("");
      }
    });
  }
)

function preflight(event, emailInputID) {
  var emailElement = document.getElementById(emailInputID);
  if (!emailElement.value || !emailElement.checkValidity()) {
    return;
  }
  //prevent page from reloading
  event.preventDefault();
  //send request
  makePreflightRequest(emailElement);
}

function makePreflightRequest(emailElement) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        console.log(response);
        if (response == "proceed") signUpFree(emailElement.value);
        return true;
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("GET","https://dailyjavascript.herokuapp.com/users/preflight",true);
  xhttp.send();
  return false;
}
// end function SignUpFree(emailInput)

function signUpFree(email) {
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

var handler = StripeCheckout.configure({
  key: 'pk_test_ZMMqCmUQPkC2QjqkA6ZknBg7',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  zipCode: true,
  token: function(token) {
    console.log(token);
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
  }
}); // end var handler = StripeCheckout.configure({

window.addEventListener("popstate", function(event) {
  handler.close();
});

function signUpEightDollars() {
  handler.open({
    image: '/img/square-image.png',
    name: 'DailyJavascript',
    description: 'DailyJavascript $8 Membership',
    amount: 800,
    panelLabel: 'Pay {{amount}}'
  });
} // end function signUpEightDollars()

function signUpTenDollars() {
  handler.open({
    image: '/img/square-image.png',
    name: 'DailyJavascript',
    description: 'DailyJavascript $10 Membership',
    amount: 1000,
    panelLabel: 'Pay {{amount}}'
  });
} // end function signUpTenDollars()