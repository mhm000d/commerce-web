export default function ShopLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <h1>Commerce</h1>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2026 Commerce</p>
      </footer>
    </>
  );
}