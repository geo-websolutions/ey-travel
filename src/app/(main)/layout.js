import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "EY Travel | Premium Egypt Tours",
  description: "Luxury Egypt tours to Luxor, Aswan, Hurghada & more. Book private guided pyramid tours and Nile cruises.",
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
        <html>
            <body className={`bg-soft-black`}>
              <header>
                <Navbar />
              </header>
                
              {children}
              <Footer />
            </body>
        </html>
  );
}
