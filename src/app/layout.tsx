"use client";

import localFont from "next/font/local";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import Layout from "./components/Layout";
import { usePathname } from "next/navigation";
import { PersistGate } from "redux-persist/integration/react";

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

export default function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const includedRoutes = ["/homePage", "/viewExpenses", "/makeBudget"];
  const isExcluded = !includedRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ChakraProvider {...props}>
              {!isExcluded ? <Layout>{children}</Layout> : <>{children}</>}
            </ChakraProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
