import { useState } from 'react';

function App() {
  const [iban, setIban] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stări pentru validarea prin CSV / Batch
  const [csvResults, setCsvResults] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);

  // --- 1. Validare individuală ---
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iban: iban.trim() }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Nu am putut contacta serverul.' });
    } finally {
      setLoading(false);
    }
  }

  // --- 2. Trimitere către Endpoint-ul Batch ---
  async function sendBulkToApi(ibansList) {
    setCsvLoading(true);
    setCsvResults([]);

    try {
      const response = await fetch('http://localhost:3000/api/validate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ibans: ibansList }),
      });

      const data = await response.json();
      // data poate fi direct array-ul sau data.results în funcție de backend
      setCsvResults(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      alert('Eroare la apelarea endpoint-ului batch.');
    } finally {
      setCsvLoading(false);
    }
  }

  // --- 3. Citire fișier CSV ---
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      // Împărțim fișierul pe linii
      const rawLines = text.split(/\r?\n/);

      // Extragem prima coloană, eliminăm ghilimelele și spațiile
      const ibans = rawLines
        .map((line) => line.split(',')[0].replace(/["']/g, '').trim())
        .filter((cleanIban) => cleanIban.length > 0 && !cleanIban.toLowerCase().includes('iban'));

      if (ibans.length === 0) {
        alert('Nu s-au găsit IBAN-uri valide în fișier.');
        return;
      }

      // Trimitem array-ul direct către endpoint-ul batch
      sendBulkToApi(ibans);
    };

    reader.readAsText(file);
    // Resetăm valoarea inputului pentru a permite reîncărcarea aceluiași fișier dacă e nevoie
    e.target.value = null;
  }

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Validator IBAN</h1>

      {/* Formular manual */}
      <section>
        <h3>Validare manuală</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="RO49AAAA1B31007593840000"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Se verifică...' : 'Validează'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '10px' }}>
            {result.valid ? (
              <p style={{ color: 'green' }}>
                IBAN valid! {result.alreadyExisted ? `(Verificat de ${result.checkCount} ori)` : '(prima verificare)'}
              </p>
            ) : (
              <p style={{ color: 'red' }}>IBAN invalid: {result.reason ?? result.error}</p>
            )}
          </div>
        )}
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* Încărcare fișier CSV */}
      <section>
        <h3>Validare multiplă (CSV)</h3>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          disabled={csvLoading} 
        />

        {csvLoading && <p>Se trimite lista către server...</p>}

        {csvResults.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4>Rezultate verificare ({csvResults.length} IBAN-uri):</h4>
            <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>IBAN</th>
                  <th>Status</th>
                  <th>Detalii</th>
                </tr>
              </thead>
              <tbody>
                {csvResults.map((item, index) => (
                  <tr key={index}>
                    <td><code>{item.iban}</code></td>
                    <td style={{ color: item.valid ? 'green' : 'red', fontWeight: 'bold' }}>
                      {item.valid ? 'Valid' : 'Invalid'}
                    </td>
                    <td>
                      {item.valid 
                        ? (item.alreadyExisted ? `Existent (${item.checkCount} verificări)` : 'Nou') 
                        : (item.reason ?? item.error ?? '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;