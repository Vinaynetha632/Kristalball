const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/', verifyToken, checkRole(['Admin', 'Logistics Officer']), (req, res) => {
    const { assetName, category, base } = req.body;
    db.run(
        'INSERT INTO assets (assetName, category, base, status) VALUES (?, ?, ?, "Available")',
        [assetName, category, base],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Asset purchased successfully' });
        }
    );
});

router.get('/', verifyToken, (req, res) => {
    db.all('SELECT * FROM assets', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
