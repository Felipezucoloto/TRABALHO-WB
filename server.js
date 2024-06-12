const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./database.sqlite');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER)');
  
  db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', ['user1', 'password123']);
  db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', ['user2', 'mypassword']);
  db.run('INSERT OR IGNORE INTO usuarios (nome, idade) VALUES (?, ?)', ['Alice', 30]);
  db.run('INSERT OR IGNORE INTO usuarios (nome, idade) VALUES (?, ?)', ['Bob', 25]);
  db.run('INSERT OR IGNORE INTO usuarios (nome, idade) VALUES (?, ?)', ['Charlie', 35]);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ status: 'error', error: err.message });
    } else if (row) {
      res.json({ status: 'success' });
    } else {
      res.status(401).json({ status: 'failure' });
    }
  });
});

app.get('/data', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
      res.status(500).json({ status: 'error', error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/search', (req, res) => {
  const query = req.query.query.toLowerCase();
  db.all('SELECT * FROM usuarios WHERE LOWER(nome) LIKE ?', [`%${query}%`], (err, rows) => {
    if (err) {
      res.status(500).json({ status: 'error', error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
