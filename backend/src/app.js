const express = require('express');
const cors = require('cors');

const ibanRoutes = require('./routes/ibanRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/validate', ibanRoutes);

app.get('/', (req, res) => {
    res.send('API - ul este functional');
});

module.exports = app;