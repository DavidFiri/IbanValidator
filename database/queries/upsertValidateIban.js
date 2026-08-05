const pool = require('../pool');

async function upsertValidateIban(iban, bankCode){
    const query = `
    INSERT INTO iban_validations (iban, bank_code)
    VALUES ($1, $2)
    ON CONFLICT (iban) DO UPDATE
        SET last_checked_at = now(),
            check_count = iban_validations.check_count + 1
    RETURNING check_count, first_checked_at
    `;
    const result = await pool.query(query, [iban, bankCode]);
    const row = result.rows[0];

    return {
        alreadyExisted: row.check_count > 1,
        firstCheckedAt: row.first_checked_at,
    };
}

module.exports = { upsertValidateIban };