import AuthGuard from "@/components/auth/AuthGuard"

export const metadata = {
  title: 'EY Travels | Create New Tour',
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
