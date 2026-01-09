import Link from 'next/link';
import "./page.css"
export default function RoleNotFound() {
  return (
    <div className='form-section' style={{ color: 'black', flexDirection: 'column' }}>
      <h2>Role Not Found</h2>
      <p>The requested role does not exist.</p>
      <div className="footer-text">
        <Link href="/">Return Home</Link>
      </div>

    </div>
  );
}