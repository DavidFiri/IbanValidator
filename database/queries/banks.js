const pool = require('../pool');

async function getKnownBankCodes(){
    const result = await pool.query('SELECT bank_code FROM banks');
    return result.rows.map(row => row.bank_code);
}
module.exports = { getKnownBankCodes };