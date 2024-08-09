import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/authContext/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry Pilot",
};

export default function RootLayout({ children }) {
  // Wrap the AuthProvider with the children so that the AuthContext is available to all pages
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