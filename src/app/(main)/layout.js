import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/Footer";
import { ToursProvider } from "@/context/TourContext";
import { DestinationProvider } from "@/context/DestinationContext";
import { CartProvider } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ScrollToTop from "@/components/navbar/ScrollToTop";
import convertFirestoreData from "@/utils/converFirestoreData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Egypt Tours | Premium Egypt Tours",
  description:
    "Discover the best Egypt tours for all budgets. Explore Luxor's ancient temples, Aswan's Nile cruises, Cairo's pyramids, and Red Sea resorts in Hurghada & Marsa Alam. Book your perfect Egyptian adventure today!",
  keywords: [
    "Egypt tours",
    "Luxor tours",
    "Aswan Nile cruise",
    "Cairo pyramids tours",
    "Hurghada excursions",
    "Marsa Alam diving",
    "affordable Egypt trips",
    "luxury Egypt travel",
    "historical Egypt tours",
    "Red Sea vacations",
  ],
  openGraph: {
    title: "Egypt Tours - Unforgettable Adventures from Luxor to the Red Sea",
    description:
      "From budget to luxury, we offer the best tours in Egypt. Explore ancient wonders, cruise the Nile, or relax at Red Sea resorts. Your perfect Egyptian experience awaits!",
    url: "https://www.eytravelegypt.com/",
    siteName: "Egypt Tours",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
        width: 1200,
        height: 630,
        alt: "EY Travel Egypt Tours featuring Luxor temples, Cairo pyramids, and Red Sea resorts",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EY Travel Egypt Tours | From Ancient Wonders to Red Sea Paradise",
    description:
      "Discover tailor-made tours for Luxor, Aswan, Cairo, Hurghada & Marsa Alam. All price ranges available!",
    images: ["/assets/icons/logo.png"],
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/",
  },
  category: "travel",
  authors: [{ name: "EY Travel Egypt Team" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    email: true,
    address: true,
    telephone: true, // Important for contact
  },
};

export const revalidate = 3600; // Revalidate every 1 hours

export default async function RootLayout({ children }) {
  // Fetch tours data
  const toursDataRef = query(collection(db, "tours"), where("basicInfo.status", "==", "active"));
  const toursData = await getDocs(toursDataRef);
  const tours = toursData.docs.map((doc) => ({
    id: doc.id,
    ...convertFirestoreData(doc.data()),
  }));

  // Fetch destinations data
  const destinationsDataRef = collection(db, "destinations");
  const destinationsData = await getDocs(destinationsDataRef);
  const destinations = destinationsData.docs.map((doc) => ({
    id: doc.id,
    ...convertFirestoreData(doc.data()),
  }));

  return (
    <html>
      <body className={`bg-soft-black`}>
        <CartProvider>
          {/* Navbar */}
          <header>
            <Navbar />
          </header>
          <ScrollToTop />
          {/* Tours and Destinations */}
          <ToursProvider toursData={tours} destinationsData={destinations}>
            <DestinationProvider destinationsData={destinations}>{children}</DestinationProvider>
          </ToursProvider>
        </CartProvider>
        <Footer />
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
