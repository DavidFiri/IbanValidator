require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
pool.connect((err, client, release) => {
    if(err){
        console.error('Eroare la conectarea la baza de date', err.stack)
    } else{
        console.log('Conectat la baza de date!');
        release();
    }
});

module.exports = pool;