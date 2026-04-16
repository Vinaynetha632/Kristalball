const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/', verifyToken, checkRole(['Admin', 'Base Commander']), (req, res) => {
    const { assetId, fromBase, toBase, date } = req.body;
    db.run(
        'INSERT INTO transfers (assetId, fromBase, toBase, date) VALUES (?, ?, ?, ?)',
        [assetId, fromBase, toBase, date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run('UPDATE assets SET base = ? WHERE id = ?', [toBase, assetId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID, message: 'Transfer recorded successfully' });
            });
        }
    );
});

router.get('/', verifyToken, (req, res) => {
    db.all(`SELECT t.*, a.assetName FROM transfers t JOIN assets a ON t.assetId = a.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
