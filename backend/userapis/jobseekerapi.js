const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());
const sql = require('mssql');

//jobseeker registration
job_seeker.post('/register', async (req, res) => {
    const { name, pass ,phone ,jobType,sex,age} = req.body;
    let id="JS"+(+phone);
    try {
        const db=req.app.get("db");
        const request=new db.Request();
        request.input('nameParam', sql.NVarChar, name);
        request.input('passParam', sql.NVarChar, pass);
        request.input('seekerIdParam', sql.VarChar, id);
        request.input('phoneParam', sql.VarChar, phone);
        request.input('ageParam', sql.Numeric, age);
        request.input('sexParam', sql.VarChar, sex);
        request.input('jobTypeParam', sql.NVarChar, jobType);
        request.query('INSERT INTO job_seeker(seeker_id,name,password,phone,age,sex,jobtype) VALUES (@seekerIdParam, @nameParam,@passParam, @phoneParam, @ageParam, @sexParam,@jobTypeParam)', (err, result) => {
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

//To get list of jobs according to JobSeeker location and JobType
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

module.exports=job_seeker;
