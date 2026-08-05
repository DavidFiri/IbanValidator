const express = require('express');

const ibanRoutes = require('./routes/ibanRoutes');

const app = express();
app.use(express.json());

app.use('/api/validate', ibanRoutes);

app.get('/', (req, res) => {
    res.send('API - ul este functional');
});

module.exports = app;