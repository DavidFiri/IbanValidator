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

/*const postIbans = async(req, res) => {
    const { ibans } = req.body
    const knownBankCodes = await getKnownBankCodes();

    for(let i = 0 ; i < ibans.length ; i++){
        if(!iban[i] || typeof iban[i] != 'string'){
            return res.status(400).json({error: `Nu s-a introdus un iban!`});
        }
        const result = validateIban(iban[0], knownBankCodes);
        if(!result.valid){
            return res.json({})
        }
    }
}*/
module.exports = {postIban};