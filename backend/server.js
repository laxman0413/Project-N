// backend/server.js
const express = require('express');
const mysql = require('mysql');
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
