import Link from 'next/link';

export default function RoleNotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Role Not Found</h2>
      <p>The requested role does not exist.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}