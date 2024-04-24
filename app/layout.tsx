"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msal";
import { InteractionType } from "@azure/msal-browser";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MsalProvider instance={msalInstance}>
          <MsalAuthenticationTemplate
            interactionType={InteractionType.Popup}
            authenticationRequest={{ scopes: ["User.Read"] }}
            errorComponent={({ error }) => <div className="w-screen h-screen flex items-center justify-center">{error?.errorMessage}</div>}
          >
            <div className="flex items-center min-h-screen px-8 py-16">{children}</div>
          </MsalAuthenticationTemplate>
        </MsalProvider>
      </body>
    </html>
  );
}
