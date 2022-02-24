# login-test
Login system with token handling and frontend. To see it in action vist [this link](https://login-test.s40.repl.co)

## Setup
This requires mongodb. The demo is using mongodb atlas but you can use your own instance as well.

Set the `db_url` env variable at this line: https://github.com/Oren-Lindsey/login-test/blob/a5e7eba3ffcd01a849476980d80fcfe9bc8e184c/index.js#L15 to the url of your mongodb database.

It also requires a token secret, which should be generated using something like the node.js crypto library:
`require('crypto').randomBytes(64).toString('hex')`.

Set the `token_secret` env variable at this line:
https://github.com/Oren-Lindsey/login-test/blob/a5e7eba3ffcd01a849476980d80fcfe9bc8e184c/index.js#L14
to the secret.

To run, enter this in the console: `node index.js`
