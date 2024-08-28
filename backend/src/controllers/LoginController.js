const db = require('../config/db');

exports.getRoutes = (req, res) => {
    db.query('SELECT * FROM resources WHERE status = "1"', (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            return res.status(500).json({ error: 'An error occurred while fetching subjects' });
        }
        res.json(results);
    });
};

