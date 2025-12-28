// backend/server.js
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE CONNECTION ---
// REPLACE 'YOUR_PASSWORD' WITH YOUR ACTUAL MYSQL PASSWORD
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dtg@1234', 
    database: 'algoviz_db'
});

db.connect(err => {
    if (err) console.error('DB Connection Failed:', err.message);
    else console.log('Connected to MySQL Database with Triggers & Procedures');
});

const SECRET_KEY = "exam_secret";

// --- ROUTES ---

// 1. REGISTER
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    
    db.query(sql, [username, hash], (err, result) => {
        if (err) return res.status(500).json({ error: "Username already taken" });
        res.status(200).json({ message: "Registered!" });
    });
});

// 2. LOGIN
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    
    db.query(sql, [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "User not found" });
        
        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Wrong password" });
        
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.status(200).json({ token, user: { id: user.id, username: user.username } });
    });
});

// 3. LOG ACTIVITY
app.post('/log-activity', (req, res) => {
    const { userId, type, name } = req.body;
    const sql = "INSERT INTO activity_logs (user_id, algorithm_type, algorithm_name) VALUES (?, ?, ?)";
    
    db.query(sql, [userId, type, name], (err) => {
        if (err) return res.status(500).json({ error: "Log failed" });
        res.status(200).json({ message: "Logged" });
    });
});

// 4. GET STATS (Stored Procedure)
app.get('/stats/:userId', (req, res) => {
    const sql = "CALL get_user_dashboard(?)";
    
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        
        const total = results[0][0]?.total || 0;
        const favorite = results[1].length > 0 ? results[1][0].algorithm_name : "None";
        const history = results[2];
        
        res.json({ total, favorite, history });
    });
});

app.listen(5000, () => console.log("Backend running on port 5000"));