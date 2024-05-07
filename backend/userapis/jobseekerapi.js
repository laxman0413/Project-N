const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());

//jobseeker registration
job_seeker.post('/register', async (req, res) => {
    const {username, phone,age,sex, location,jobtype}=req.body;
    const sql = 'INSERT INTO job_seeker (username, phone,age,sex, location,jobtype) VALUES (?, ?, ?, ?)';
    const values = [username, phone,age,sex, location,jobtype];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('User registered successfully');
    });
});

//To get list of jobs according to JobSeeker location and JobType
job_seeker.get("/joblist",(req, res) => {
    const {location,jobtype}=req.body;
    const sql = 'SELECT * FROM jobs where location=(?) and jobtype=(?)';
    const db=req.app.get("db");
    db.query(sql,[location,jobtype], (err, result) => {
    if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
    } else {
        res.status(200).json(result);
    }
    });
});

module.exports=job_seeker;
