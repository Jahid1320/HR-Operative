const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scenario', require('./routes/scenario'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/news', require('./routes/news'));

// Basic Route
// Serve Frontend in Production/Cloud
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL) {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
} else {
    // Basic Route for Development
    app.get('/', (req, res) => {
        res.send('Global Payroll Crisis Simulator API is running');
    });
}

// Sync Database and Start Server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});

