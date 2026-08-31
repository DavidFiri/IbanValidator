const { validateIban } = require('../validation/ibanValidator');
const { getKnownBankCodes} = require('../../../database/queries/getKnownBankCodes');
const { upsertValidateIban } = require('../../../database/queries/upsertValidateIban');

const postIban = async(req, res) => {
    try{
         
        const { iban } = req.body;
        if(!iban || typeof iban != 'string'){
            return res.status(400).json({error: 'Campul iban este obligatoriu, in format text!'});
        }
        const knownBankCodes = await getKnownBankCodes();
        const result = validateIban(iban, knownBankCodes);
        if(!result.valid){
             return res.json(result); // {valid: false, reason: ....}
        }

        const {alreadyExisted, firstCheckedAt, checkCount} = await upsertValidateIban(result.normalizedIban, result.bankCode);

        return res.json({valid: true, alreadyExisted, firstCheckedAt, checkCount})
    }catch(err){
        return res.status(500).json({error: 'A aparut o eroare interna!'});
    }
}

const postIbans = async (req, res) => {
  try {
    const { ibans } = req.body;

    if (!Array.isArray(ibans) || ibans.length === 0) { // varificam daca am primit un array din body ul requestului
      return res.status(400).json({ error: 'Câmpul "ibans" trebuie să fie un array nevid.' });
    }

    const knownBankCodes = await getKnownBankCodes();
    const results = [];

    for (let i = 0; i < ibans.length; i++) {
      if (!ibans[i] || typeof ibans[i] !== 'string') {
        results.push({ iban: ibans[i], valid: false, reason: 'INVALID_INPUT' });
        continue;
      }

      const result = validateIban(ibans[i], knownBankCodes); // verificam fiecare iban in parte, daca nu este valid, adaugam motivul in array ul de rezultate

      if (!result.valid) {
        results.push({ iban: ibans[i], valid: false, reason: result.reason });
        continue;
      }

      const { alreadyExisted, firstCheckedAt, checkCount } = await upsertValidateIban(
        result.normalizedIban,
        result.bankCode
      );
      results.push({ iban: ibans[i], valid: true, alreadyExisted, firstCheckedAt, checkCount });
    }

    return res.json({ results }); // un singur raspuns, dupa ce bucla s-a terminat complet
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'A apărut o eroare internă.' });
  }
};
module.exports = {postIban, postIbans};