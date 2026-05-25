const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Database Connection ---
const mongoUri = process.env.USE_LOCAL_DB === 'true'
  ? process.env.LOCAL_MONGO_URI
  : process.env.CLOUD_MONGO_URI;

if (!mongoUri) {
  console.error(' No MongoDB URI provided.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log(`Database connected: ${mongoUri.includes('localhost') ? 'Local' : 'Cloud'}`))
  .catch((err) => console.error(' Database not connected:', err));

app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/workers', require('./src/routes/workers'));

// --- Page Routes ---

app.get('/', (req, res) => {
    res.render('login', { error: null });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid username or password. Please try again.' });
    }
});

app.get('/dashboard', (req, res) => {
    res.render('landingpage');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});