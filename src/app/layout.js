import { AuthContextProvider } from '@/auth';
import { GlobalStoreContextProvider } from '@/store';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Playlister",
  description: "Music Playlist Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthContextProvider>
          <GlobalStoreContextProvider>
            {children}
          </GlobalStoreContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}