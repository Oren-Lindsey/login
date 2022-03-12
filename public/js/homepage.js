const main = document.getElementById('main')
fetch('/session')
  .then(res => res.json())
  .then(data => {
    main.innerText = `Logged in successfully as @${data.name}!`
  })
