import "./globals.css";

export const metadata = {
  title: "EFRO Control Center",
  description: "Operatives Kontrollsystem für EFRO"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
