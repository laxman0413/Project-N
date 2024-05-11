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