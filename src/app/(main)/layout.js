import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import { ToursProvider } from "@/context/TourContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ScrollToTop from "@/components/navbar/ScrollToTop";
import convertFirestoreData from "@/utils/converFirestoreData";

export const metadata = {
  metadataBase: new URL('https://eytravelsegypt.com/'),
  title: "Egypt Tours | Premium Egypt Tours",
  description: "Discover the best Egypt tours for all budgets. Explore Luxor's ancient temples, Aswan's Nile cruises, Cairo's pyramids, and Red Sea resorts in Hurghada & Marsa Alam. Book your perfect Egyptian adventure today!",
  keywords: [
    "Egypt tours", "Luxor tours", "Aswan Nile cruise", 
    "Cairo pyramids tours", "Hurghada excursions", 
    "Marsa Alam diving", "affordable Egypt trips",
    "luxury Egypt travel", "historical Egypt tours",
    "Red Sea vacations"
  ],
  openGraph: {
    title: "Egypt Tours - Unforgettable Adventures from Luxor to the Red Sea",
    description: "From budget to luxury, we offer the best tours in Egypt. Explore ancient wonders, cruise the Nile, or relax at Red Sea resorts. Your perfect Egyptian experience awaits!",
    url: "https://eytravelsegypt.com/",
    siteName: "Egypt Tours",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
        width: 1200,
        height: 630,
        alt: "EY Travel Egypt Tours featuring Luxor temples, Cairo pyramids, and Red Sea resorts"
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EY Travel Egypt Tours | From Ancient Wonders to Red Sea Paradise",
    description: "Discover tailor-made tours for Luxor, Aswan, Cairo, Hurghada & Marsa Alam. All price ranges available!",
    images: ['/assets/icons/logo.png'],
  },
  alternates: {
    canonical: 'https://eytravelsegypt.com/',
  },
  category: 'travel',
  authors: [{ name: 'EY Travel Egypt Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  formatDetection: {
    email: false,
    address: false,
    telephone: true, // Important for contact
  },
};

export const revalidate = 86400; // Revalidate every 24 hours

export default async function RootLayout({ children }) {
  const toursDataRef = collection(db, "tours");
  const toursData = await getDocs(toursDataRef);

  const tours = toursData.docs.map((doc) => ({
    id: doc.id,
    ...convertFirestoreData(doc.data()),
  }));

  return (
    <html>
      <body className={`bg-soft-black`}>
        <header>
          <Navbar />
        </header>
        <ScrollToTop />
        <ToursProvider toursData={tours}>{children}</ToursProvider>
        <Footer />
      </body>
    </html>
    
  );
}

