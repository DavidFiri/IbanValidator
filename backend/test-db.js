const { getKnownBankCodes } = require("../database/queries/banks");

getKnownBankCodes()
  .then(codes => console.log('Coduri gasite:', codes))
  .catch(err => console.error('Eroare conexiune:', err));