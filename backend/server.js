require('dotenv').config({ path: './token.env' }); // Load JWT secret from token.env
require('dotenv').config({ path: './credentials.env' }); // Load database credentials from credentials.env
const sql = require('mssql');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  driver: process.env.DRIVER,
  options: {
    trustedConnection: process.env.TRUSTED_CONNECTION === 'true'
  }
};
sql.connect(config, function (err) {
  if (err) console.log("Error while connecting database :- " + err);
  else console.log("Database connected successfully");
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
  const { username, password, phone, role, location, age, sex } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    console.log('Hashed password:', hashedPassword); // Log for verification

    let sqlQuery;
    let values;

    if (role === 'provider') {
      sqlQuery = 'INSERT INTO job_provider (name, password, phone) VALUES (@username, @hashedPassword, @phone)';
      values = { username, hashedPassword, phone };
    } else if (role === 'seeker') {
      sqlQuery = 'INSERT INTO job_seeker (name, password, phone, age, sex, location) VALUES (@username, @hashedPassword, @phone, @age, @sex, @location)';
      //console.log('name: ',username, 'password: ',hashedPassword, 'phone: ',phone, 'age: ',age );
      values = { username, hashedPassword, phone, location, age, sex };
    } else {
      return res.status(400).send('Invalid role specified');
    }

    const request = new sql.Request();
    for (let key in values) {
      request.input(key, values[key]);
    }

    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('User registered successfully');
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error registering user');
  }
});








app.post('/login', (req, res) => {
  const { phone, password, role } = req.body;

  // Determine the correct table based on the user role
  let table;
  if (role === 'provider') {
      table = 'job_provider';
  } else if (role === 'seeker') {
      table = 'job_seeker';
  } else {
      return res.status(400).send('Invalid role specified');
  }

  const sqlQuery = `SELECT * FROM ${table} WHERE phone = @phone`;
  const request = new sql.Request();
  request.input('phone', sql.VarChar, phone);
  request.query(sqlQuery, async (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.recordset.length === 0) {
          return res.status(404).send('User not found');
      }

      const user = results.recordset[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
          const userIdField = role === 'provider' ? 'providerid' : 'seekerid';
          const token = jwt.sign(
              { id: user[userIdField], phone: user.phone, role }, // include user ID and role in the token
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