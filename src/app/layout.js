import "./globals.css";

export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
