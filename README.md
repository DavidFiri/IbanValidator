# Validator IBAN

Aplicație web full-stack pentru validarea IBAN-urilor din România — verifică formatul, cifra de control (ISO 7064) și codul băncii, ține un istoric al verificărilor, și suportă validare în masă dintr-un fișier.

![Node.js](https://img.shields.io/badge/Node.js-backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-frontend-61DAFB?logo=react&logoColor=black)

## Ce face

- Validează IBAN-uri românești: structură, cifră de control (algoritmul MOD 97-10) și cod de bancă existent
- Ține un istoric al IBAN-urilor verificate, într-o bază de date PostgreSQL
- Permite validare în masă, dintr-un fișier CSV/TXT cu mai multe IBAN-uri
- Interfață web simplă, construită în React

## Stack tehnologic

- **Backend:** Node.js, Express
- **Bază de date:** PostgreSQL
- **Frontend:** React (Vite)

## Exemplu

```http
POST /api/validate
Content-Type: application/json

{ "iban": "RO49AAAA1B31007593840000" }
```

```json
{
  "valid": true,
  "alreadyExisted": false,
  "firstCheckedAt": "2026-09-01T12:00:00.000Z"
}
```

## Cum rulezi local

### Cerințe

- Node.js
- PostgreSQL (rulând local sau accesibil de pe mașina ta)

### Pași

1. Clonează depozitul și instalează dependențele:

   ```bash
   git clone <url-ul-repo-ului>
   cd IbanValidator/backend && npm install
   cd ../frontend && npm install
   ```

2. Creează un fișier `.env` în `backend/`, cu datele tale de conectare la PostgreSQL:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=iban_validator
   DB_USER=postgres
   DB_PASSWORD=parola_ta
   ```

3. Rulează, în ordine, scripturile SQL din folderul de migrări (`database/migrations/`), ca să creezi și să populezi tabelele.

4. Pornește backend-ul:

   ```bash
   cd backend
   node server.js
   ```

5. Pornește frontend-ul, într-un terminal separat:

   ```bash
   cd frontend
   npm run dev
   ```

6. Deschide adresa afișată de Vite (implicit `http://localhost:5173`).
