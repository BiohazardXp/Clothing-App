const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;

// Create or connect to SQLite database
const db = new sqlite3.Database('./clothing_store.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Create tables if they don't exist
db.run(`
    CREATE TABLE IF NOT EXISTS Admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS Items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        imageUrl TEXT
    )
`);

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM Admin WHERE username = ?', [username], (err, admin) => {
        if (err || !admin) return res.status(401).json({ message: 'Invalid credentials' });

        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ success: true, token });
        });
    });
});

// Add new item (admin only)
app.post('/api/admin/addItem', authenticateToken, (req, res) => {
    const { itemName, itemPrice, itemImage } = req.body;
    db.run('INSERT INTO Items (name, price, imageUrl) VALUES (?, ?, ?)', 
        [itemName, itemPrice, itemImage], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding item' });
        res.json({ success: true, message: 'Item added successfully' });
    });
});

// Get all items (open to public)
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM Items', (err, items) => {
        if (err) return res.status(500).json({ message: 'Error retrieving items' });
        res.json(items);
    });
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
