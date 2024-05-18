const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifytoken');

//jobseeker registration
job_seeker.post('/register', async (req, res) => {
    const { name, pass, phone, jobType, age, sex } = req.body;
    const db=req.app.get("db");
    const request=new db.Request();
  try {
    const hashedPassword = await bcrypt.hash(pass, 10); // Hash the password
    const sqlQuery = 'INSERT INTO job_seeker (name, password, phone, age, sex, jobType) VALUES (@name, @hashedPassword, @phone, @age, @sex, @jobType)';
      //console.log('name: ',username, 'password: ',hashedPassword, 'phone: ',phone, 'age: ',age );
    let values = { name, hashedPassword, phone, jobType, age, sex };
    for (let key in values) {
      request.input(key, values[key]);
    }
    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send({message:'Internal Server Error'});
      }
      res.status(201).send({message:'User registered successfully'});
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
            return res.status(500).send({message:'Internal Server Error'});
        }
        if (results.recordset.length === 0) {
            return res.status(404).send({message:'User not found'});
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
            res.status(200).json({message: 'Logged in successfully!',token:token,payload:user});
        } else {
            res.status(401).send({message:'Invalid credentials'});
        }
    });
  });

//To get list of jobs according to JobSeeker jobType and JobType
job_seeker.get("/jobdetails",verifyToken,(req, res) => {
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
job_seeker.get('/profile', verifyToken, (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  const { id } = req.res.locals.decode.id // Get user ID from decoded token
  console.log('id: ', id);

  const sqlQuery = `SELECT * FROM job_seeker WHERE seeker_id = @id`;
  request.input('id', sql.Int, id);
  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(result.recordset[0]);
  });
});


module.exports=job_seeker;
