"use client"


import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "./store.provider";
import Navbar from "@/components/Navbar";
import GetInitialState from "./GetInitialState";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <GetInitialState>
            <Navbar />
            {children}
          </GetInitialState>
        </body>
      </ReduxProvider>
    </html>
  );
}
