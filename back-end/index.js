const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv').config();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const { request } = require('express');

bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 48 * 1000,
    },
  })
);

const db = mysql.createConnection({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// REGISTER ---------------------------------------------------------------------------------
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

//LOGIN -----------------------------------------------------------------------------------------
app.get('/login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Date formatter -----------------------
  function getDateInFormat() {
    function toString(number, padLength) {
      return number.toString().padStart(padLength, '0');
    }

    let date = new Date();

    let dateTimeNow =
      toString(date.getFullYear(), 4) +
      '-' +
      toString(date.getMonth() + 1, 2) +
      '-' +
      toString(date.getDate(), 2) +
      ' ' +
      toString(date.getHours(), 2) +
      ':' +
      toString(date.getMinutes(), 2) +
      ':' +
      toString(date.getSeconds(), 2);
    return dateTimeNow;
  }
  //-----------------------------------------

  // ip getter ------------------------------
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // console.log(ip);
  // ----------------------------------------

  db.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
        throw err;
      } else {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              req.session.user = result;
              res.send(result);
              console.log(`User ${result[0].username} logged in.`);
              // ---
              const dbQuery = `
                INSERT INTO login_history 
                (login_time, user_id, ip_number)
                 VALUES 
                ('${getDateInFormat()}', ${result[0].id}, '${ip}')
                 `;

              db.query(dbQuery, (err, res) => {
                if (err) throw err;

                if (res.affectedRows > 0) {
                  console.log('User logged-in.');
                } else {
                  console.error('Login operation error.');
                }
              });
              // ---
            } else {
              res.send({ message: 'Wrong username or password.' });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    }
  );
});

// LOGOUT ------------------------------------------------------------------------------------------
app.get('/logout', (req, res) => {
  res.send({ loggedIn: false, user: null });
  req.session.destroy();
  console.log('User logged out.');
});

app.listen(3001, () => {
  console.log('running server');
});
