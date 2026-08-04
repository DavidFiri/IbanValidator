require('dotenv').config({});

function normalizeIban(string){
    string = string.replaceAll(" ", "");
    string = string.toUpperCase();
    return string;
}
function hasValidFormat(string){
    const pattern = /^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/;
    let result = pattern.test(string);
    return result;
}
function letterToNumber(string){
    return string.toUpperCase().replace(/[A-Z]/g, (litera) => {
        return litera.charCodeAt(0) - 55;
    });
}
function isCheckSumValid(string){// implementare algoritm MOD 97 - 10
    string = string.slice(4) + string.slice(0,4); //punem primele 4 caractere alphanumerice din iban la coada
    string = letterToNumber(string);
    if(BigInt(string) % 97n == 1n) return true;
        return false;
}
function extractBankCode(string){
    return string.substring(4,8);
}
//functia principala de validare a ibanului
function validateIban(iban, knownBankCodes){
    iban = normalizeIban(iban);
    if(!hasValidFormat(iban)) return {valid: false, reason: 'INVALID_FORMAT'};
    if(!isCheckSumValid(iban)) return{valid: false, reason: 'INVALID_CHECKSUM'};
    if(!knownBankCodes.includes(extractBankCode(iban))) return {valid: false, reason: 'UNKNOWN_BANKCODE'};
    return {valid: true};
}
let iban = String(process.env.IBAN_VALID); 
console.log(validateIban(iban));
