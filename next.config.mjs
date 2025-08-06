/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL('https://knfanjrmktlgwcmmucok.supabase.co/storage/v1/object/public/tour-images/**')],
  },
};

export default nextConfig;
