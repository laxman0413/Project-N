const express = require('express');
const job_provider = express();
job_provider.use(express.json());

//to register a Job_Provider
job_provider.post('/register', async (req, res) => {
    const { username, phone, location } = req.body;
    try {
        const sql = 'INSERT INTO jobprovider(Name, JobProviderID, Location, Phone) VALUES (?, ?, ?,?)';
        let id="JP"+(+phone);
        const values = [username,id,location, phone];
        const db=req.app.get("db");
        db.query(sql, values, (err, result) => {
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
    const sql = 'SELECT * FROM jobs where jobProviderId=(?)';
    const db=req.app.get("db");
    db.query(sql,[id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(result);
      }
    });
});


module.exports=job_provider;
  