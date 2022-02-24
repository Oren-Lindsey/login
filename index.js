const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const port = 3000
const bcrypt = require ('bcrypt');
const User = require("./schema.js")
const ejs = require('ejs')
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const saltRounds = 10;

//setup env vars
const token_secret = process.env['token-secret']
const db_url = process.env['db_url']

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/html/login.html');
})

app.get('/new-account', (req, res) => {
  res.sendFile(__dirname + '/public/html/new-account.html');
})

app.post('/create-account', (req, res) => {
  var userdata = {
    username: req.body.username,
    password: req.body.password
  }
  addUserToDb(req.body.username, req.body.password, true, false)
  const token = generateAccessToken({ username: req.body.username });
  res.send({'message': 'user created', 'token': token, 'data': userdata})
})

app.post('/session', async (req, res) => {
  const reqData = req.body
  const doc = await getUserFromDb(reqData.username)
  if (doc === null) {
    res.status(401).send({'error': 'incorrect username or password'})
  } else {
    passwordCheck = await isPasswordCorrect(doc.password, reqData.password)
    if (passwordCheck) {
      console.log('USER LOGGED IN SUCCESSFULLY!!!!!!!!!')
      var userData = {'username': reqData.username}
      const token = generateAccessToken({ username: reqData.username });
      res.set('Set-Cookie', `token=${token}`)
      res.send({'token': token});
    } else {
      res.status(401).send({'error': 'incorrect username or password'})
    }
  }
})

app.get('/logged-in', authenticateToken, (req, res) => {
  var userData = []
  userData.username = req.user.username
  ejs.renderFile(__dirname + '/public/html/logged-in.html', userData, function(err, str){
      res.send(str);
    });
})

app.get('/account-created', (req, res) => {
  res.sendFile(__dirname + '/public/html/account-created.html');
})

app.listen(port, () => {
  console.log(`Example app listening at https://login-test.s40.repl.co`)
})

async function hashPassword(password) {
  var hash = await bcrypt.hash(password, saltRounds)
  var passwordData = {
    hashedPassword: hash
  }
  return passwordData
}
async function isPasswordCorrect(hash, passwordAttempt) {
  var result = await bcrypt.compare(passwordAttempt, hash)
  return result
}
async function addUserToDb(username, unhashedpassword, admin, root) {
  await mongoose.connect(db_url);
  var passwordData = await hashPassword(unhashedpassword)
  var password = passwordData.hashedPassword
  const newUser = new User({
    'name': username, 
    'password': password,
      'permissions': {
        'admin': admin, 
        'root': root
      } 
    })
  await newUser.save();
}

async function getUserFromDb(username) {
  await mongoose.connect(db_url); 
  var doc = await User.findOne({name: new RegExp('^'+username+'$', "i")})
  return doc
}
function generateAccessToken(username) {
  return jwt.sign(username, token_secret, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const token = req.cookies['authorization']

  if (token == null) return res.sendStatus(401)
  const secretAsString = token_secret // as string
  jwt.verify(token, token_secret, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    } else {
      req.user = user
      next()
    }
  })
}