// global variables
plan = "";

//

function showModal(response) {
  new Array(...document.getElementsByClassName('fade')).forEach((element) => {
    if (element.id === response || element.classList.contains('modal-backdrop')) {
      element.classList.add('show');
      element.style.display = 'block';
      element.removeAttribute('aria-hidden')
      element.scrollTop = 0
      document.body.className="modal-open";
    }
  })
}

function hideModal() {
  new Array(...document.getElementsByClassName('fade')).forEach((element) => {
    if (element.classList.contains('show')){
      element.classList.remove('show');
      element.style.display = 'none';
      element.setAttribute('aria-hidden', true)
      element.scrollTop = 0
      document.body.className=""
    }
  })
}

function toggleModal(response) {
  document.getElementById(response)
    .className
    .indexOf('show') > -1
    ? hideModal()
    : showModal(response);
}

function addCustomErrorMessage(emailInput){
  if (emailInput.validity.patternMismatch) {
    emailInput.setCustomValidity("Email does not appear to be a valid email address");
  } else {
    emailInput.setCustomValidity("");
  }
}

function maybeAddErrorStyling(emailInput){
  if (emailInput.validity.valid && (emailInput.nextElementSibling.classList.contains('error')) || emailInput.value === "") {
    emailInput.classList.remove('error-border');
    emailInput.nextElementSibling.classList.remove('error');
    return;
  } else if (emailInput.validity.valid){
    return;
  } else {
    emailInput.classList.add('error-border');
    emailInput.nextElementSibling.classList.add('error')
  }
}
//get html collection of input elements and convert into an array
new Array(...document.getElementsByTagName('input')).forEach(
  (emailInput) =>{
    emailInput.addEventListener("input", function () {
      addCustomErrorMessage(emailInput);
      maybeAddErrorStyling(emailInput);
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
} // end function preflight(event, emailInputID)

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
} // end function makePreflightRequest(emailElement)

function signUpFree(email) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response == "good") {
          // --- action for successful free signup
          // replace below code
          toggleModal("success");
        } else if (response == "bad") {
          // --- action for failure of free signup
          toggleModal("failure");
        } // end if...else response
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&membership_level=free&membership_code=1");
} // end function SignUpFree(emailInput)

function createStripeSubscription(stripeToken) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response == "good") {
          // ---------  action for successful paid subscription
          // replace below code
          showModal("success");
        } else if (response == "bad") {
          // --------- action for failure of paid subscription
          showeModal("failure");
        } // end if...else response
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send("email=" + stripeToken.email + "&membership_level=" + plan + "&membership_code=2&stripe_token_id=" + stripeToken.id);
} // end function createStripeSubscription(stripeToken)

var handler = StripeCheckout.configure({
  key: 'pk_test_ZMMqCmUQPkC2QjqkA6ZknBg7',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  zipCode: true,
  token: function(token) {
    createStripeSubscription(token);
  }
}); // end var handler = StripeCheckout.configure({

window.addEventListener("popstate", function(event) {
  handler.close();
});

function signUpEightDollars() {
  plan = "eight_dollars";
  handler.open({
    image: '/img/js.png',
    name: 'Daily JavaScript',
    description: 'Daily JavaScript $8 Membership',
    amount: 800,
    panelLabel: 'Pay {{amount}}'
  });
} // end function signUpEightDollars()

function signUpTenDollars() {
  plan = "ten_dollars";
  handler.open({
    image: '/img/js.png',
    name: 'Daily JavaScript',
    description: 'Daily JavaScript $10 Membership',
    amount: 1000,
    panelLabel: 'Pay {{amount}}'
  });
} // end function signUpTenDollars()
