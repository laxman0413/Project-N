const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//jobseeker registration
job_seeker.post('/register', async (req, res) => {
    const { name, pass, phone, jobType, age, sex } = req.body;
    const db=req.app.get("db");
    const request=new db.Request();
  try {
    const hashedPassword = await bcrypt.hash(pass, 10); // Hash the password
    console.log('Hashed password:', hashedPassword); // Log for verification
    console.log("username: ",name)
    const sqlQuery = 'INSERT INTO job_seeker (name, password, phone, age, sex, jobType) VALUES (@name, @hashedPassword, @phone, @age, @sex, @jobType)';
      //console.log('name: ',username, 'password: ',hashedPassword, 'phone: ',phone, 'age: ',age );
    let values = { name, hashedPassword, phone, jobType, age, sex };
    for (let key in values) {
      request.input(key, values[key]);
    }
    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error registering user');
  }
});

//jobseeker login
job_seeker.post('/login', async (req, res) => {
    const db=req.app.get("db");
    const request=new db.Request();
    const { phone, password} = req.body;
    const sqlQuery = `SELECT * FROM job_seeker WHERE phone = @phone`;
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
            const token = jwt.sign(
                { id: user.seeker_id, phone: user.phone }, // include user ID and role in the token
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

//To get list of jobs according to JobSeeker jobType and JobType
job_seeker.get("/jobdetails",(req, res) => {
    const {location,jobtype}=req.body;
    const db=req.app.get("db");
    const request=new db.Request();
    request.input('locatonParam', sql.NVarChar, location);
    request.input('jobtypeParam', sql.VarChar, jobtype);
    request.query('Select * from jobdetails', (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send(result);
    });
});


//To get list of jobseekers 
job_seeker.get("/job-seeker-details",(req, res) => {
    const db=req.app.get("db");
    const request=new db.Request();
    request.query('Select * from job_seeker', (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send(result);
    });
});


module.exports=job_seeker;
