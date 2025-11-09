export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/contact"),
  title: "Contact EY Travel Egypt | Start Your Premium Egyptian Adventure",
  description:
    "Begin crafting your perfect Egypt tour with our travel experts. Get personalized advice for luxury Nile cruises, Red Sea escapes, and cultural experiences.",
  keywords: [
    "Egypt tours contact",
    "Luxor tours",
    "Aswan Nile cruise",
    "affordable Egypt trips",
    "luxury Egypt travel",
    "historical Egypt tours",
    "Red Sea vacations",
  ],
  openGraph: {
    title: "Egypt Tours - Unforgettable Adventures from Luxor to the Red Sea",
    description:
      "From budget to luxury, we offer the best tours in Egypt. Explore ancient wonders, cruise the Nile, or relax at Red Sea resorts. Your perfect Egyptian experience awaits!",
    url: "https://www.eytravelegypt.com/contact",
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
    canonical: "https://www.eytravelegypt.com/contact",
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
    email: false,
    address: false,
    telephone: true, // Important for contact
  },
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
