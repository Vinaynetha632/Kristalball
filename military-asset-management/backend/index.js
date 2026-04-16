const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'supersecretkey123'; // demo key

const { verifyToken, checkRole } = require('./middleware/auth');

// Auth routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'invalid credentials' });
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(401).json({ error: 'invalid credentials' });
            
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        });
    });
});

app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err.message });
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role || 'Logistics Officer'], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
    });
});

// Import specific routes
const purchasesRoutes = require('./routes/purchases');
const transfersRoutes = require('./routes/transfers');
const assignmentsRoutes = require('./routes/assignments');

app.use('/api/purchases', purchasesRoutes);
app.use('/api/transfers', transfersRoutes);
app.use('/api/assignments', assignmentsRoutes);

// General assets
app.get('/api/assets', (req, res) => {
    db.all('SELECT * FROM assets', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
