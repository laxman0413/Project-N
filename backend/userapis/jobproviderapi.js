const express = require('express');
const job_provider = express();
job_provider.use(express.json());
const sql = require('mssql');

//to register a Job_Provider
job_provider.post('/register', async (req, res) => {
    const { username, phone, location } = req.body;
    let id="JP"+(+phone);
    try {
        const db=req.app.get("db");
        const request=new db.Request();
        request.input('nameParam', sql.NVarChar, username);
        request.input('providerIdParam', sql.VarChar, id);
        request.input('locationParam', sql.NVarChar, location);
        request.input('phoneParam', sql.Numeric, phone);
        request.query('INSERT INTO jobProvider(name, provider_id, location, phone) VALUES (@nameParam, @providerIdParam, @locationParam, @phoneParam)', (err, result) => {
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
  
//to post a new job
job_provider.post('/addJob', (req, res) => {
    const {
      jobTitle,
      jobProviderID,
      jobType,
      customJobType,
      payment,
      peopleNeeded,
      location,
      date,
      time,
      jobDescription,
    } = req.body;
  
    const sql = `
      INSERT INTO jobdetails
      (jobTitle,jobProviderID, jobType, customJobType, payment, peopleNeeded, location, date, time,jobDescription)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const db=req.app.get("db");
    db.query(sql, [jobTitle,jobProviderID, jobType, customJobType, payment, peopleNeeded, location, date, time,jobDescription], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Job added successfully');
      }
    });
});

//to get the list of jobs which the JobProvider Post
job_provider.get('/jobdetails', (req, res) => {
  const id=req.body;
    const sql = 'SELECT * FROM jobProvider';
    const db=req.app.get("db");
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(result);
      }
    });
});


module.exports=job_provider;
  