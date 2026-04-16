const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/', verifyToken, checkRole(['Admin', 'Base Commander', 'Logistics Officer']), (req, res) => {
    const { assetId, assignedTo, date } = req.body;
    db.run(
        'INSERT INTO assignments (assetId, assignedTo, date) VALUES (?, ?, ?)',
        [assetId, assignedTo, date],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run('UPDATE assets SET status = "Assigned" WHERE id = ?', [assetId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID, message: 'Assignment recorded' });
            });
        }
    );
});

router.get('/', verifyToken, (req, res) => {
    db.all(`SELECT asm.*, a.assetName FROM assignments asm JOIN assets a ON asm.assetId = a.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
