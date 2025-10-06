"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persister, store } from "@/redux/store";
import { SnackbarProvider } from 'notistack';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Authentication App",
//   description: "Created in NextJs by Parmeet Kumar",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persister}>
              {children}
            </PersistGate>
          </Provider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
