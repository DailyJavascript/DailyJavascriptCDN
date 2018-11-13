// forEacH polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback/*, thisArg*/) {

    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat while k < len.
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator.
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c.
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined.
  };
}


// global variables
let plan = "";
let modalResponse = {
  Failure: "Uh, oh!  Looks like there's an issue.  Please try again later.",
  Success: "Thank you for joining Daily JavaScript!",
  Loading: ""
}

let objectData = {
  Failure: './img/fail_mark.svg',
  Success: './img/success_checkmark.svg',
  Loading: './img/loading.svg'
}

let btnClass = {
  Failure: 'btn-danger',
  Success: 'btn-success',
  Loading: 'hidden'
}

//
function updateModal(response){
  document.getElementById('json-response').innerText = modalResponse[response];
  document.getElementById('modal-header-text').innerHTML = (response === "Loading") ? "Processing Signup" : response;
  if (response === "Loading") {
    document.getElementById('modal-header-text').classList.add('loading-text');
  } 

  if (response !== "Loading" && document.getElementById('modal-header-text').classList.contains('loading-text')){
    document.getElementById('modal-header-text').classList.remove('loading-text');
  }
  var obj = document.getElementById('modal-object');
  obj.classList.add(response.toLowerCase());
  obj.data = objectData[response];
  document.getElementById("modal-img").src = objectData[response];
  Object.keys(btnClass).forEach((btn) => {
    if (btnClass[btn]) {
      document.getElementById('modal-btn').classList.add(btnClass[btn]);
    } else{
      document.getElementById('modal-btn').classList.remove(btn);
    }
  })
}

function showModal(response) {
  Array.from(document.getElementsByClassName('fade')).forEach((element) => {
    if (element.id === 'modal' || element.classList.contains('modal-backdrop')) {
      element.classList.add('show');
      element.style.display = 'block';
      element.removeAttribute('aria-hidden')
      element.scrollTop = 0
      document.body.className="modal-open";
    }
  })

  updateModal(response)
}


function hideModal() {
  Array.from(document.getElementsByClassName('fade')).forEach((element) => {
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
  document.getElementById('modal')
    .className
    .indexOf('show') > -1
    ? updateModal(response)
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
Array.from(document.getElementsByTagName('input')).forEach(
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
          toggleModal("Success");
        } else if (response == "bad") {
          // --- action for failure of free signup
          toggleModal("Failure");
        } // end if...else response
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&membership_level=free&membership_code=1");
} // end function SignUpFree(emailInput)

function createStripeSubscription(stripeToken) {
  var xhttp = new XMLHttpRequest();
  // let currentTime = Date.now();
  toggleModal('Loading');
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response == "good") {
          // ---------  action for successful paid subscription
          // replace below code
          toggleModal("Success");
        } else if (response == "bad") {
          // --------- action for failure of paid subscription
          toggleModal("Failure");
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
