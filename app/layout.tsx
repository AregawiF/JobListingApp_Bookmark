"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import store from "./service/store";
import { Provider } from "react-redux";
import Header from "./components/Header";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Job Listing App</title>
      </head>
      <Provider store={store}>
        <SessionProvider>
          <body>
            <Header/>
            {children}
          </body>
        </SessionProvider>
      </Provider>
    </html>
  );
}
