import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

// Dynamically import AuthProvider with SSR disabled
const AuthProvider = dynamic(() => import("./contexts/authContext"), { ssr: false });

export const metadata = {
  title: "Pantry Pilot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}