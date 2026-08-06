import { useState } from 'react';

function App() {
  const [iban, setIban] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // oprim comportamentul default al formularului (refresh de pagina)
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iban }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Nu am putut contacta serverul.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Validator IBAN</h1>
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
        <div>
          {result.valid ? (
            <p>IBAN valid! {result.alreadyExisted ? `(era deja în baza de date|Verficat de ${result.checkCount})` : '(prima verificare)'}</p>
          ) : (
            <p>IBAN invalid: {result.reason ?? result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;