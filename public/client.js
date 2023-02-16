// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

// define variables that reference elements on our page
const santaForm = document.forms[0];
const wish = document.getElementById('wish');
const child_name = document.getElementById('userid');

// listen for the form to be submitted and add a new dream when it is
santaForm.onsubmit = function (event) {
  // TODO: check the text isn't more than 100chars before submitting
  event.preventDefault();
  console.log(child_name);
  childInfoCheck(child_name.value);
  
};
function childInfoCheck(name){
    const child_reg = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';
    fetch(child_reg)
    .then(res => res.json())
    .then( data => {
      console.log(data);
      const testData = data.find(dt => dt.username === name) ?? 
      { username: "Default", uid: '-1' };
      console.log(name);
      if(testData.uid != -1){
        getChildData(testData);
      }
      else{
        gotoErrorPage();
      }
    })
}

function getChildData(obj){
    const child_info = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';
    const uid = obj.uid;
    fetch(child_info)
    .then(response => response.json())
    .then(data => data.find(dt => {
      if(dt.userUid == uid){
        if( 10 > calculateAge(dt.birthdate)){
          const child_obj = {
            'name': obj.username,
            'address': dt.address,
            'wish': wish.value
          }
          sendDataToServer(child_obj);
        }
        else{
          gotoErrorPage();
        }
      }
  }))
}

function calculateAge(birthdate) {
  var today = new Date();
  var birthDate = new Date(birthdate);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
function gotoErrorPage(){
  fetch("/faliure")
  .then(res =>{
    window.location.replace(res.url);
  })
}
function sendDataToServer(child_obj){
  fetch("/success", {
    method: "POST",
    body: JSON.stringify(child_obj),
    headers: {
      "Content-Type": "application/json"
      }
    })
    .then(response => {
      console.log('respose data ',response.url);
      window.location.replace(response.url);
      // response.sendFile(response.url)
    })
    .catch(error => {
      console.error(error);
    });
}

