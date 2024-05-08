require('dotenv').config({ path: './token.env' }); // Load JWT secret from token.env
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test_for_react',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the other side!');
});

app.get('/jobdetails', (req, res) => {
  const sql = 'SELECT * FROM jobdetails';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/addJob', (req, res) => {
  const {
    jobTitle,
    jobType,
    customJobType,
    payment,
    peopleNeeded,
    location,
    date,
    time,
  } = req.body;

  const sql = `
    INSERT INTO jobdetails
    (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Job added successfully');
    }
  });
});

app.post('/register', async (req, res) => {
  const { username, password, phone, role, location } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      if (role === 'provider') {
          const sql = 'INSERT INTO job_provider (username, password, phone) VALUES (?, ?, ?)';
          const values = [username, hashedPassword, phone];
          db.query(sql, values, (err, result) => {
              if (err) {
                  console.error('Error executing query:', err);
                  return res.status(500).send('Internal Server Error');
              }
              res.status(201).send('User registered successfully');
          });
      } else if (role === 'seeker') {
          const sql = 'INSERT INTO job_seeker (username, password, phone, location) VALUES (?, ?, ?, ?)';
          const values = [username, hashedPassword, phone, location];
          db.query(sql, values, (err, result) => {
              if (err) {
                  console.error('Error executing query:', err);
                  return res.status(500).send('Internal Server Error');
              }
              res.status(201).send('User registered successfully');
          });
      } else {
          return res.status(400).send('Invalid role specified');
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error registering user');
  }
});




app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  // Determine the correct table based on the user role
  let table;
  if (role === 'provider') {
      table = 'job_provider';
  } else if (role === 'seeker') {
      table = 'jobseeker';
  } else {
      return res.status(400).send('Invalid role specified');
  }

  const sql = `SELECT * FROM ${table} WHERE username = ?`;
  db.query(sql, [username], async (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          return res.status(404).send('User not found');
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
          const userIdField = role === 'provider' ? 'providerid' : 'seekerid';
          const token = jwt.sign(
              { id: user[userIdField], username: user.username, role }, // include user ID and role in the token
              process.env.JWT_SECRET,
              { expiresIn: '72h' }
          );

          // Set cookie with the JWT
          res.cookie('jwt', token, {
              httpOnly: true,
              maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
              secure: process.env.NODE_ENV === "production" // send only over HTTPS in production
          });
          res.status(200).json({ message: 'Logged in successfully!' });
      } else {
          res.status(401).send('Invalid credentials');
      }
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});