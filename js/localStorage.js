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

if (!parseLocalStorageJSON('visitID')){
  postRefCode();
} else {
  window.visitID = parseLocalStorageJSON('visitID');
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
   xhr.open("POST", 'http://localhost:3000/visits/update', true);
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   let params = `field=${fieldName}&value=${value}&vistID=${visitID}`;
   xhr.send(params);
 };
  this.maybePostActivity = function(){
    if (window.visitID){
      while (this.size > 0) {
       let activity = this.remove();
       this.postUserActivity(activity.fieldName, activity.value, activity.visitID);
      }
    } else {
      return;
    }
  }
}

window.UserActivity = new UserActivity();