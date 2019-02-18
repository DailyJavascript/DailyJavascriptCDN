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

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

function UserActivity() {
  this.queue = [];
  this.add = function(activity) {
     this.queue.push(activity);
  };
  this.remove = function() {
     return this.queue.pop();
  };
  this.size = function() {
     return this.queue.length;
  };

  this.postUserActivity = function(fieldName, value, visitID) {
   const xhr = new XMLHttpRequest();
   if (!xhr) {
     return false;
   }
   xhr.open("POST", 'https://dailyjavascript.herokuapp.com/visits/update', true);
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   let params = `field=${fieldName}&value=${value}&visitID=${visitID}`;
   xhr.send(params);
 };
  this.maybePostActivity = function(){
    if (window.visitID){
      while (this.size() > 0) {
       let activity = this.remove();
       this.postUserActivity(activity.fieldName, activity.value, activity.visitID);
      }
    } else {
      return;
    }
  }
}

const lazyLoad = () => {
  // let lazyLoadedIframe = document.getElementById('iframe-video-lazy');
  // lazyLoadedIframe.src = "https://www.youtube.com/embed/6fud8HA-wP4";
  // lazyLoadedIframe.width = "440";
  // lazyLoadedIframe.height = "315";
  // lazyLoadedIframe.frameborder  = 0;
  // lazyLoadedIframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  // lazyLoadedIframe.allowfullscreen = true;

  const imgSrc = {
    "calendar": "img/calendar.svg",
    "blackboard": "img/blackboard.svg",
    "online-class": "img/online-class.svg",
    "amazon": "img/amazon2.svg",
    "groupon": "img/groupon.svg",
    "ford": "img/ford.svg",
    "testing-suite": "img/testing-suite-3.png",
  }

  let imgCollection = Array.prototype.slice.call(document.getElementsByTagName('img'));
  imgCollection.forEach((img) => {
    if (img.dataset.img){
      img.src = imgSrc[img.dataset.img];
    }
  });

}

function handleStripeSetup() {
  handler = StripeCheckout.configure({
    key: 'pk_live_5ZgfXMNd2JnfWkv9bgW8xRJ4',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    zipCode: true,
    token: function (token) {
      preflight(null, null, "paid", token);
    }
  }); // end var handler = StripeCheckout.configure({

  window.addEventListener("popstate", function (event) {
    handler.close();
  });
}

const UserActivitySectionFlags = {
  instructions: 0,
  testimonials: 0,
  payment: 0,
  sample_of_paid_features: 0,
  sample_question: 0,
  didClickTestPage: 0
}

function Activity(fieldName, value) {
  return {
    fieldName: fieldName,
    value: value,
    visitID: window.visitID || parseLocalStorageJSON('visitID')
  }
}
// `field=${didScroll}&value=${}`

var captureUserActivity = function(e, plan=null) {
  if (e.target.type === "email") {
    UserActivity.add(new Activity('didInputEmail', true));
    UserActivity.add(new Activity('emailInputValue', e.target.value));
  }

  if (e.target.type === "submit") {
    UserActivity.add(new Activity('didClickPayment', true));
    UserActivity.add(new Activity('plan', plan));
  }

  if (e.type === "mouseover" && !UserActivitySectionFlags['didClickTestPage']){
    UserActivity.add(new Activity('didClickTestPage', true));
    UserActivitySectionFlags.didClickTestPage = 1;
  }

  UserActivity.maybePostActivity();
}

var options = {
  root: null,
  rootMargin: '0px',
  threshold: [0]
}

var callback = function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && window.UserActivity && !UserActivitySectionFlags[entry.target.id]) {
      UserActivity.add(new Activity('sectionID', entry.target.id));
      UserActivitySectionFlags[entry.target.id] = 1;
      UserActivity.maybePostActivity();
    }
  });
};

// --------- local storage functions
const localStorageSupported = () => {
  try {
    const key = "testLocalStorage";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

const storeInLocalStorage = (key, value) => {
  const jsonValue = JSON.stringify(value);
  if (localStorageSupported()) {
    try {
      window.localStorage.setItem(key, jsonValue);
    } catch(e) {
      return;
    }
  }
};

const clearFromLocalStorage = (key) => {
  if (localStorageSupported()) {
    try {
      window.localStorage.removeItem(key);
    } catch(e) {
      return;
    }
  }
};

//item is a string that is the key stored in the browser's local storage
const parseLocalStorageJSON = (item) => {
  if (localStorageSupported()) {
    try {
      return JSON.parse(window.localStorage.getItem(item));
    } catch(e) {
      return false;
    }
  }
};

function getUrlParams() {
  var vars = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function() {
    //the arguments passed in will always be the same
    vars[arguments[1]] = arguments[2];
  });
  return vars;
}

// --- refcode functions
function getRefCode(){
  if(getUrlParams()['refcode']){
    return "refcode="+ getUrlParams()['refcode'];
  } else {
    return ""
  }
}

function postRefCode() {
  const xhr = new XMLHttpRequest();
  const refcode = getRefCode();

  if (!xhr) {
    return false;
  }

  xhr.open("POST", 'https://dailyjavascript.herokuapp.com/visits', true);
  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      storeInLocalStorage('visitID', xhr.response);
      window.visitID = xhr.response;
      UserActivity.maybePostActivity();
    }
  }
  xhr.send("blogVisit=0&"+refcode);
}

function addModalHeader(response) {
  document.getElementById('modal-header-text').innerHTML = (response === "Loading") ? "Processing Signup" : response;
}

function maybeAddLoadingElipsis(response){
  if (response === "Loading" && !document.getElementById('modal-header-text').classList.contains('loading-elipsis')) {
    document.getElementById('modal-header-text').classList.add('loading-elipsis')
  }

  if (response !== "Loading" && document.getElementById('modal-header-text').classList.contains('loading-elipsis')){
    document.getElementById('modal-header-text').classList.remove('loading-elipsis')
  }
}

function addButtonCSS(response) {
  document.getElementById('modal-btn').classList.add(btnClass[response]);
  if (response !== "Loading"){
    document.getElementById('modal-btn').classList.remove('hidden');
  }
}

function updateModal(response){
  document.getElementById('json-response').innerText = modalResponse[response];
  addModalHeader(response);
  if (response === "Success"){
    document.getElementById('cta-social').style.display = 'inline-block';
  } else {
    if (document.getElementById('cta-social').style.display === 'inline-block'){
      document.getElementById('cta-social').style.display = "none"
    }
  }
  maybeAddLoadingElipsis(response);
  var img = document.getElementById('modal-img');
  if (response !== "loading") {
    img.classList.remove('loading');
  }
  img.classList.add(response.toLowerCase());
  img.src = objectData[response];
  addButtonCSS(response);
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

  document.getElementById('modal-img').src = "";
}

function toggleModal(response) {
  let currentTime = Date.now();
  if (document.getElementById('modal').className.indexOf('show') > -1) {
    if (Date.now() - currentTime < 1000) {
      setTimeout(()=> { updateModal(response) }, 1000)
    } else {
      updateModal(response);
    }
  } else {
    showModal(response);
  }
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

function preflight(event, emailInputID, membershipLevel, stripeToken) {
  var emailElement = null;
  if (!!emailInputID) {
    emailElement = document.getElementById(emailInputID);
    if (!emailElement.value || !emailElement.checkValidity()) {
      return;
    }
  }
  //prevent page from reloading
  if (!!event) event.preventDefault();
  //send request
  toggleModal('Loading');
  makePreflightRequest(emailElement, membershipLevel, stripeToken);
} // end function preflight(event, emailInputID, membershipLevel)

function makePreflightRequest(emailElement, membershipLevel, stripeToken) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response == "proceed") signUp(emailElement, membershipLevel, stripeToken);
        return true;
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("GET","https://dailyjavascript.herokuapp.com/users/preflight",true);
  xhttp.send();
  return false;
} // end function makePreflightRequest(emailElement)

function getPriceForSpecialOffer() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response != "not found") {
          document.getElementById("premiumPrice").innerHTML = parseFloat(response);
          price = parseFloat(response) * 100;
          plan = getUrlParams()["special_offer_code"];
        }
        return true;
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("GET","https://dailyjavascript.herokuapp.com/users/get_price/?special_offer_code="+getUrlParams()["special_offer_code"],true);
  xhttp.send();
  return false;
} // end function makePreflightRequest(emailElement)

function signUp(emailElement, membershipLevel, stripeToken) {
  var data = null;
  if (membershipLevel == "free") {
    data = "email="+emailElement.value+"&membership_level=free&membership_code=1";
  }

  if (membershipLevel == "paid") {
    data = "email=" + stripeToken.email + "&membership_level=" + plan + "&membership_code=2&stripe_token_id=" + stripeToken.id;
  }

  if (!!parseLocalStorageJSON('visitID')) {
    data = data + '&visitID=' + parseLocalStorageJSON('visitID');
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText + "";
        if (response == "good") {
          // --- action for successful signup
          // replace below code
          toggleModal("Success");
        } else if (response == "bad") {
          // --- action for failure of signup
          toggleModal("Failure");
        } // end if...else response
    } // end if (this.readyState == 4 && this.status == 200)
  } // end xhttp.onreadystatechange = function()
  xhttp.open("POST","https://dailyjavascript.herokuapp.com/users",true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send(data);
} // end function SignUpFree(emailInput)

function openStripePopup(membershipLevel, e) {
  captureUserActivity(e, membershipLevel);

  handler.open({
    image: '/img/js.png',
    name: 'Daily JavaScript',
    description: "Daily JavaScript Premium Membership",
    amount: price,
    panelLabel: 'Pay {{amount}}'
  });
} // end function openStripePopup(membershipLevel)
// ------ Below this line are code from Stripe, above this line is our own code -----------

// ----- event listeners
window.addEventListener('load', function(){
  window.UserActivity = new UserActivity();

  if (!!getUrlParams()['special_offer_code']){
    getPriceForSpecialOffer();
  }


  if (!parseLocalStorageJSON('visitID')){
    postRefCode();
  } else {
    window.visitID = parseLocalStorageJSON('visitID');
  }

  var observer = new IntersectionObserver(callback, options);

  ["instructions", "payment", 'testimonials', "sample_of_paid_features", "sample_question"].forEach( (id) => {
    var target = document.getElementById(id);
    observer.observe(target);
  })

  if (getUrlParams()['refcode'] === "ecf85b5bebb743ceb675"){
    UserActivity.add(new Activity('didClickUpgradeLink', true));
    UserActivity.maybePostActivity();
  }

  document.addEventListener('scroll', function() {
    lazyLoad();
  }, {once: true})
});

