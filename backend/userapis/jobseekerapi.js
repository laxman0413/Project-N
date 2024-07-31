const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const twilio = require('twilio');



//jobseeker registration
job_seeker.post('/register', async (req, res) => {
    const { name, pass, phone, jobType, age, sex } = req.body;
    const db=req.app.get("db");
    const request=new db.Request();
  try {
    const result = await request.query(`select * from job_seeker where phone='${phone}'`);
    if (result.recordset.length > 0) {
      return res.status(208).json({ message: "user already exists please login" });
    }
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

job_seeker.get('/appliedJobs', verifyToken, async (req, res) => {
  const seekerId = req.res.locals.decode.id;
  
  try {
    const db = req.app.get("db");
    const request = new db.Request();
    const result = await request.input('seeker_id', sql.VarChar, seekerId)
                                .query('select jd.jobTitle,jd.peopleNeeded,jd.jobType,jd.date,jd.time,jd.payment,jd.customJobType,jd.description,jd.location,jd.negotiability,jd.payment,jd.provider_id,ja.application_id from job_applications ja, job_seeker js, jobdetails jd where jd.id=ja.id and ja.seeker_id=js.seeker_id and ja.seeker_id=@seeker_id;');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).send('Internal Server Error');
  }
});


//To get list of jobseekers 
job_seeker.get('/profile', verifyToken, (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  
  // Ensure the id is correctly extracted
  const { id } = req.res.locals.decode;

  const sqlQuery = `SELECT * FROM job_seeker WHERE seeker_id = @id`;

  // Use sql.VarChar instead of sql.Int
  request.input('id', sql.VarChar, id);

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

job_seeker.delete('/withdrawJob/:application_id', verifyToken, async (req, res) => {
  const { application_id } = req.params;
  const seekerId = req.res.locals.decode.id;

  try {
      const db = req.app.get("db");
      const request = new db.Request();
      const result = await request.input('application_id', sql.Int, application_id)
          .input('seeker_id', sql.VarChar, seekerId)
          .query('DELETE FROM job_applications WHERE application_id = @application_id AND seeker_id = @seeker_id');

      if (result.rowsAffected[0] > 0) {
          res.status(200).send({ message: 'Application withdrawn successfully' });
      } else {
          res.status(404).send({ message: 'Application not found' });
      }
  } catch (error) {
      console.error('Error withdrawing job application:', error);
      res.status(500).send('Internal Server Error');
  }
});
//To apply for a particular job
job_seeker.post('/accept-job', verifyToken, (req, res) => {
  const db = req.app.get("db");
  const request = new sql.Request();
  const { id } = req.body; // Ensure this is correctly received from the request body
  const { id: seeker_id } = res.locals.decode; // Get seeker ID from the token

  if (!id) {
    return res.status(400).send({ message: 'Job ID is required' });
  }

  const sqlQuery = `
      INSERT INTO job_applications (seeker_id, id, application_date)
      VALUES (@seeker_id, @job_id, GETDATE())
  `;

  request.input('seeker_id', sql.VarChar, seeker_id);
  request.input('job_id', sql.Int, id); // Ensure id is correctly passed as job_id

  request.query(sqlQuery, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send({ message: 'Internal Server Error' });
      }
      res.status(201).send({ message: 'Job accepted successfully' });
  });
});

//any testing routes
require('dotenv').config({ path: './twilio.env' });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Route to send OTP
job_seeker.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const db = req.app.get("db");
    const request = new db.Request();
    const timestamp = new Date();

    const checkQuery = `SELECT * FROM otp_verification WHERE phone = @phone`;
    const insertQuery = `INSERT INTO otp_verification (phone, otp, created_at) VALUES (@phone, @otp, @timestamp)`;
    const updateQuery = `UPDATE otp_verification SET otp = @otp, created_at = @timestamp WHERE phone = @phone`;
    const deleteQuery = `DELETE FROM otp_verification WHERE phone = @phone`;

    request.input('phone', sql.VarChar, phone);
    request.input('otp', sql.VarChar, otp);
    request.input('timestamp', sql.DateTime, timestamp);

    request.query(checkQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        if (results.recordset.length > 0) {
            request.query(deleteQuery, (err) => {
                if (err) {
                    console.error('Error deleting previous OTP:', err);
                    return res.status(500).send({ message: 'Internal Server Error' });
                }

                request.query(insertQuery, (err) => {
                    if (err) {
                        console.error('Error inserting new OTP:', err);
                        return res.status(500).send({ message: 'Internal Server Error' });
                    }

                    sendOtpMessage(phone, otp, res);
                });
            });
        } else {
            request.query(insertQuery, (err) => {
                if (err) {
                    console.error('Error inserting OTP:', err);
                    return res.status(500).send({ message: 'Internal Server Error' });
                }

                sendOtpMessage(phone, otp, res);
            });
        }
    });
});

const sendOtpMessage = async (phone, otp, res) => {
    try {
        await client.messages.create({
            from: '+12517650937',
            to: "+91"+phone,
            body: `Your OTP code is ${otp}`
        });
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ message: 'Error sending OTP' });
    }
};

// Route to verify OTP
job_seeker.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    const db = req.app.get("db");
    const request = new db.Request();

    const sqlQuery = `SELECT * FROM otp_verification WHERE phone = @phone AND otp = @otp`;
    request.input('phone', sql.VarChar, phone);
    request.input('otp', sql.VarChar, otp);

    request.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        if (results.recordset.length === 0) {
            return res.status(404).send({ message: 'Invalid OTP' });
        }

        const otpRecord = results.recordset[0];
        const currentTime = new Date();
        const otpTimestamp = new Date(otpRecord.created_at);
        const timeDifference = (currentTime - otpTimestamp) / 1000 / 60; // Difference in minutes

        if (timeDifference > 10) {
            return res.status(400).send({ message: 'OTP has expired' });
        }

        res.status(200).send({ message: 'OTP verified successfully' });
    });
});

// Route to reset password
job_seeker.post('/reset-password', async (req, res) => {
    const { phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = req.app.get("db");
    const request = new db.Request();

    const sqlQuery = `UPDATE job_seeker SET password = @password WHERE phone = @phone`;
    request.input('phone', sql.VarChar, phone);
    request.input('password', sql.VarChar, hashedPassword);

    request.query(sqlQuery, (err) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        res.status(200).send({ message: 'Password reset successfully' });
    });
});






module.exports=job_seeker;