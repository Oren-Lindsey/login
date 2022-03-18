const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const error = document.getElementById('error')
const message = document.getElementById('message')

username.addEventListener('invalid', invalid);
password.addEventListener('invalid', invalid);
form.addEventListener('submit', formSubmit);

function invalid(event) {
  error.removeAttribute('hidden');
}

function formSubmit(event) {
  var reqData = {'username': username.value, 'password': password.value};
  var stringifiedData = JSON.stringify(reqData)
  const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringifiedData
    };
  fetch('/session', requestOptions)
    .then(res => res.json())
    .then(data => loginRes(data))
  event.preventDefault();
}
function loginRes(data) {
  if (data.hasOwnProperty('error')) {
    error.innerText = `Error: ${data.error}`
    if (error.hasAttribute('hidden')) {
      error.removeAttribute('hidden');
    }
  } else {
    message.innerText = 'Logged in successfully, please wait...'
    message.removeAttribute('hidden');
    document.cookie = `authorization=${data.token}`
    window.location.replace('/')
  }
}
