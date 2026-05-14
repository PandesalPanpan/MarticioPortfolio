import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ maxWidth: 768, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--muted)', marginTop: 16 }}>
        That page doesn't exist. <Link to="/">Go home</Link>.
      </p>
    </main>
  );
}
