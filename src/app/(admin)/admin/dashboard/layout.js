import AuthGuard from "@/components/auth/AuthGuard"

export const metadata = {
  title: 'EY Travels | Admin Panel',
}

export default function RootLayout({ children }) {
  return (
    <>
      <AuthGuard>
        {children}
      </AuthGuard>
    </>
  )
}
