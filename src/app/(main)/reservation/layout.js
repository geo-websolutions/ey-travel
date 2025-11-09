export const metadata = {
  metadataBase: new URL("https://www.eytravelegypt.com/"),
  title: "Reservation Process | EY Travel Egypt | Secure Tour Booking & Payment",
  description:
    "Secure your Egypt tour with EY Travel Egypt's simple 6-step reservation process. Book Luxor, Aswan, Nile cruise tours with Stripe payment protection. 24-hour confirmation.",
  keywords: [
    "Egypt tour reservation",
    "EY Travel Egypt booking",
    "Nile cruise reservation",
    "Luxor tours booking",
    "Aswan tour packages",
    "secure Egypt tour payment",
    "Stripe payment Egypt tours",
    "tour availability check",
    "Egypt travel booking process",
    "24-hour tour confirmation",
    "group tour reservation",
    "Egypt vacation booking",
    "secure online payment",
    "tour payment link",
    "Egypt travel reservation",
  ],
  openGraph: {
    title: "Reservation Process | EY Travel Egypt Secure Tour Booking",
    description:
      "Simple 6-step reservation process for EY Travel Egypt tours. Secure Stripe payments, 24-hour confirmation, and expert local service guarantee.",
    url: "https://www.eytravelegypt.com/reservation",
    siteName: "EY Travel Egypt",
    images: [
      {
        url: "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
        width: 1200,
        height: 630,
        alt: "EY Travel Egypt reservation process - secure tour booking and payment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservation Process | EY Travel Egypt",
    description:
      "Secure your Egypt adventure with our simple booking process. Stripe payments, 24-hour confirmation, expert service.",
    images: [
      "https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/OpenGraph/og_image.png",
    ],
  },
  alternates: {
    canonical: "https://www.eytravelegypt.com/reservation",
  },
  category: "travel",
  authors: [{ name: "EY Travel Egypt Team" }],
};

export default function RootLayout({ children }) {
  return <>{children}</>;
}
