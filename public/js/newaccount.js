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
  fetch('/create-account', requestOptions)
    .then(res => res.json())
    .then(data => handleRes(data))
  event.preventDefault();
}
function handleRes(data) {
  if (data.hasOwnProperty('message')) {
    document.cookie = `authorization=${data.token}`
    window.location.replace('/')
  } else if (data.hasOwnProperty('error')) {
    if (data.error == 'must match regex /^[a-z0-9_\\-]{1,20}$/') {
      error.innerText = 'Error! usernames must be between 1 and 20 characters long and can only contain letters, numbers, underscores, and dashes.'
      error.removeAttribute('hidden')
    } else {
      error.innerText = data.error
      error.removeAttribute('hidden')
    }
  } else {
    error.innerText = 'An unknown error occurred. Please try again'
    error.removeAttribute('hidden')
  }
}
