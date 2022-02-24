const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const error = document.getElementById('error')

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
  fetch('https://login-test.s40.repl.co/create-account', requestOptions)
    .then(res => res.json())
    .then(data => handleRes(data))
  event.preventDefault();
}
function handleRes(data) {
  document.cookie = `authorization=${data.token}`
  window.location.replace('/logged-in')
}