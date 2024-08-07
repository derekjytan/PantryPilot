import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/authContext/page";

const inter = Inter({ subsets: ["latin"] });

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